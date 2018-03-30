package api

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"database/sql"

	"github.com/gin-gonic/gin"

	// psql stuff
	_ "github.com/lib/pq"

	jsoniter "github.com/json-iterator/go"

	"net"

	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/types"
)

// ApiLayer is a layer which handles manipulation of
// sending and retrieving data to the beaconing API
//
//
// NOTE: all of these functions need a SessionContext
// for the access token verification. maybe in the future
// we should redo this to take just an access token because
// that might make the api layer a bit more flexible.

// API is the main instance to the api helper
// this performs any api requests necessary
var API *CoreAPIManager

// ────────────────────────────────────────────────────────────────────────────────

func GetOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}

func GetProtocol() string {
	if gin.IsDebugging() {
		return "http://"
	}

	return "https://"
}

func GetBaseLink() string {
	if gin.IsDebugging() {
		// we have to slap the port on there
		return GetOutboundIP().String() + ":8081"
	}

	host := cfg.Beaconing.Server.Host

	if host == "" {
		log.Fatal("Server Host not defined in config!")
	}

	return cfg.Beaconing.Server.Host
}

func GetRootPath() string {
	return GetProtocol() + GetBaseLink()
}

func GetRedirectBaseLink() string {
	return GetRootPath() + "/intent/token/"
}

func GetLogOutLink() string {
	return GetProtocol() + GetBaseLink() + "/"
}

// SetupAPIHelper sets up an instanceof the API manager
// should not be called more than once (in theory!)
func SetupAPIHelper() {
	API = newAPIHelper()
}

// formatRequest generates ascii representation of a request
func formatRequest(r *http.Request) string {
	// Create return string
	var request []string
	// Add the request string
	url := fmt.Sprintf("%v %v %v", r.Method, r.URL, r.Proto)
	request = append(request, url)
	// Add the host
	request = append(request, fmt.Sprintf("Host: %v", r.Host))
	// Loop through headers
	for name, headers := range r.Header {
		name = strings.ToLower(name)
		for _, h := range headers {
			request = append(request, fmt.Sprintf("%v: %v", name, h))
		}
	}

	// If this is a POST, add post data
	if r.Method == "POST" {
		r.ParseForm()
		request = append(request, "\n")
		request = append(request, r.Form.Encode())
	}

	// Return the request as a string
	return strings.Join(request, "\n")
}

func DoTimedRequestBody(s *gin.Context, method string, url string, reqBody io.Reader, timeout time.Duration) ([]byte, error) {
	return DoTimedRequestBodyHeaders(s, method, url, reqBody, timeout, map[string]string{
		"accept":        "application/json",
		"authorization": fmt.Sprintf("Bearer %s", GetAccessToken(s)),
	})
}

// DoTimedRequestBody does a timed request of type {method} to {url} with an optional {reqBody}, if
// there is no body pass nil, as well as a timeout can be specified.
func DoTimedRequestBodyHeaders(s *gin.Context, method string, url string, reqBody io.Reader, timeout time.Duration, headers map[string]string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	req, err := http.NewRequest(method, url, reqBody)
	{
		for key, val := range headers {
			req.Header.Add(key, val)
		}
	}

	log.Println("Doing timed request of\n", formatRequest(req))

	// sort of hacky but it should work fine.
	if method == "POST" || method == "PUT" {
		req.Header.Set("Content-Type", "application/json")
	}

	if err != nil {
		log.Println("DoTimedRequestBody", err.Error())
		return []byte{}, err
	}

	resp, err := http.DefaultClient.Do(req.WithContext(ctx))
	if err != nil {
		log.Println("DoTimedRequestBody", err.Error())
		return []byte{}, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println("DoTimedRequestBody", err.Error())
		return []byte{}, err
	}

	return body, nil
}

// DoTimedRequest is the same as DoTimedRequestBody, however it does not have
// a body passed to the request.
func DoTimedRequest(s *gin.Context, method string, url string, timeout time.Duration) ([]byte, error) {
	fmt.Printf("%s%s\n", "URL: ", url)
	data, err := DoTimedRequestBody(s, method, url, nil, timeout)
	return data, err
}

// CoreAPIManager manages all of the api middleman requests, etc.
// as well as caching any json/requests that are frequently requested
type CoreAPIManager struct {
	APIPath string
	cache   *apiCache
	db      *sql.DB
}

// GetUserID returns the current users id number, if there is no
// current user session it returns -1
func GetUserID(s *gin.Context) (uint64, error) {
	obj, _ := GetCurrentUser(s)
	if obj == nil {
		return 0, errors.New("No such user")
	}
	return obj.Id, nil
}

// getPath creates an API path, appending on the given beaconing URL
// "https://core.beaconing.eu/api/", this makes concatenation painless
// as well as it slaps the access token on the end
func (a *CoreAPIManager) getPath(s *gin.Context, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s", path)
}

// GetCurrentUser returns an object with information about the current
// user, as well as the JSON string decoded from the object.
func GetCurrentUser(s *gin.Context) (*types.CurrentUser, error) {
	resp, err := DoTimedRequest(s, "GET", API.getPath(s, "currentuser"), 5*time.Second)
	if err != nil {
		log.Println("GetCurrentUser", err.Error())
		return nil, err
	}

	student := &types.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, student); err != nil {
		log.Println("GetCurrentUser", err.Error())
		return nil, err
	}

	// TODO probably some caching can be done here.

	// try load the user avatar from the local
	// database, if we fail  set the user avatar
	// and re-load it.
	// TODO if we fail again return some error
	// identicon and spit the error out in the logs
	avatar, err := getUserAvatar(s, student.Id)
	if err != nil {
		log.Println("getUserAvatar", err.Error())

		avatar, err = setUserAvatar(s, student.Id, student.Username)
		if err != nil {
			log.Println("setUserAvatar", err.Error())
			avatar = "TODO identicon fall back here"
		}
	}
	student.IdenticonSha512 = avatar

	return student, nil
}

func getUserAvatar(s *gin.Context, id uint64) (string, error) {
	query := "SELECT avatar_blob FROM student_avatars WHERE student_id = $1"
	rows, err := API.db.Query(query, id)
	if err != nil {
		log.Println("-- ", err.Error())
		return "", err
	}

	defer rows.Close()
	for rows.Next() {
		var avatarHash []byte

		err = rows.Scan(&avatarHash)
		if err != nil {
			log.Println("-- Failed to request row in avatar_blob query!", err.Error())
			continue
		}

		return string(avatarHash), nil
	}

	if err := rows.Err(); err != nil {
		log.Println("getUserAvatar DB Error", err.Error())
		return "", err
	}

	return "", errors.New("Failed to get avatar_blob of user")
}

func setUserAvatar(s *gin.Context, id uint64, username string) (string, error) {
	if API.db == nil {
		log.Println("-- No database connection has been established")
		return "", errors.New("No database connection")
	}

	input := fmt.Sprintf("%d%s", id, username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))

	avatarHash := base64.StdEncoding.EncodeToString(hmac512.Sum(nil))
	log.Println("Setting avatar hash for student ", id, username, " to ", avatarHash)

	query := "INSERT INTO student_avatars (student_id, avatar_blob) VALUES($1, $2)"
	_, err := API.db.Exec(query, id, avatarHash)
	if err != nil {
		log.Println("-- ", err.Error())
		return "", err
	}

	return avatarHash, nil
}

// TODO the toml layout for loading the
// database could be a lot better.
// but for now it works.
func newAPIHelper() *CoreAPIManager {
	log.Println("-- Creating new API instance:")
	log.Println("--- DB USER: ", cfg.Beaconing.DB.Username)
	log.Println("--- DB PASS: ", cfg.Beaconing.DB.Password)
	log.Println("--- DB NAME: ", cfg.Beaconing.DB.Name)
	log.Println("--- DB TABLE: ", cfg.Beaconing.DB.Table)
	log.Println("--- DB SSL ENABLED: ", cfg.Beaconing.DB.SSL)

	// TODO if we are in release mode use SSL!

	sslMode := "verify-full"
	if !cfg.Beaconing.DB.SSL {
		sslMode = "disable"
	}

	connStr := "user=" + cfg.Beaconing.DB.Username + " dbname=" + cfg.Beaconing.DB.Name + " sslmode=" + sslMode
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println("Failed to open db conn", err.Error())
	}

	log.Println("--- Database connection established.")

	return &CoreAPIManager{
		APIPath: "https://core.beaconing.eu/api/",
		cache:   newAPICache(),
		db:      db,
	}
}