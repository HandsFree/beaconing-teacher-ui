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

	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/types"
)

// ApiLayer is a layer which handles manipulation of
// sending and retrieving data to the beaconing API

// API is the main instance to the api helper
// this performs any api requests necessary
var API *CoreAPIManager

// timeout for api requests (set to 120 seconds temporarily)
const timeout = 120 * time.Second

// ────────────────────────────────────────────────────────────────────────────────

// GetOutboundIP is a helper function to get the
// current computers outbound IP.
func GetOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP
}

// GetProtocol returns the protocol in which
// the server should run in. By default this is
// https, unless gin is in debug mode, in which case
// it will run in HTTP
//
// this assumption is made as debug mode will only be
// run locally and not in production so https is not necessary
// or easily configurable
func GetProtocol() string {
	if gin.IsDebugging() {
		return "http://"
	}
	return "https://"
}

// GetBaseLink returns the base server host
// link, this is loaded from the configuration file
// however, when gin is in debug mode this is
// the computers ip with the port (loaded from the config file)
func GetBaseLink() string {
	if gin.IsDebugging() {
		// we have to slap the port on there
		return GetOutboundIP().String() + ":" + fmt.Sprintf("%d", cfg.Beaconing.Server.Port)
	}

	host := cfg.Beaconing.Server.Host

	if host == "" {
		log.Fatal("Server Host not defined in config!")
	}

	return cfg.Beaconing.Server.Host
}

func getRootPath() string {
	return GetProtocol() + GetBaseLink()
}

// GetRedirectBaseLink returns the link for
// redirecting the api tokens
func GetRedirectBaseLink() string {
	return getRootPath() + "/api/v1/token/"
}

// GetLogOutLink ...
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

// DoTimedRequestBody ...
func DoTimedRequestBody(s *gin.Context, method string, url string, reqBody io.Reader) ([]byte, error) {
	return DoTimedRequestBodyHeaders(s, method, url, reqBody, map[string]string{
		"accept":        "application/json",
		"authorization": fmt.Sprintf("Bearer %s", GetAccessToken(s)),
	})
}

// DoTimedRequestBodyHeaders does a timed request of type {method} to {url} with an optional {reqBody}, if
// there is no body pass nil, as well as a timeout can be specified.
func DoTimedRequestBodyHeaders(s *gin.Context, method string, url string, reqBody io.Reader, headers map[string]string) ([]byte, error) {
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
func DoTimedRequest(s *gin.Context, method string, url string) ([]byte, error) {
	fmt.Printf("%s%s\n", "URL: ", url)
	data, err := DoTimedRequestBody(s, method, url, nil)
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
	resp, err := DoTimedRequest(s, "GET", API.getPath(s, "currentuser"))
	if err != nil {
		log.Println("GetCurrentUser", err.Error())
		return nil, err
	}

	teacher := &types.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, teacher); err != nil {
		log.Println("GetCurrentUser", err.Error())
		return nil, err
	}

	// TODO probably some caching can be done here.

	// try load the user avatar from the local
	// database, if we fail  set the user avatar
	// and re-load it.
	// TODO if we fail again return some error
	// identicon and spit the error out in the logs
	avatar, err := getUserAvatar(s, teacher.Id)
	if err != nil {
		log.Println("getUserAvatar", err.Error())

		avatar, err = setUserAvatar(s, teacher.Id, teacher.Username)
		if err != nil {
			log.Println("setUserAvatar", err.Error())
			avatar = "TODO identicon fall back here"
		}
	}
	teacher.IdenticonSha512 = avatar

	return teacher, nil
}

func getUserAvatar(s *gin.Context, id uint64) (string, error) {
	query := "SELECT avatar_blob FROM student_avatar WHERE student_id = $1"
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

	query := "INSERT INTO student_avatar (student_id, avatar_blob) VALUES($1, $2)"
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
	log.Println("--- DB USER:", cfg.Beaconing.DB.Username)
	log.Println("--- DB PASS:", cfg.Beaconing.DB.Password)
	log.Println("--- DB NAME:", cfg.Beaconing.DB.Name)
	log.Println("--- DB SSL ENABLED:", cfg.Beaconing.DB.SSL)

	// TODO if we are in release mode use SSL!

	sslMode := "verify-full"
	if !cfg.Beaconing.DB.SSL {
		sslMode = "disable"
	}

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s",
		cfg.Beaconing.DB.Username,
		cfg.Beaconing.DB.Password,
		cfg.Beaconing.DB.Name,
		sslMode)

	log.Println("--- Attempting to connect to PSQL database: '" + connStr + "'")

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println("[FATAL] Failed to open db conn", err.Error())
	}

	err = db.Ping()
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
