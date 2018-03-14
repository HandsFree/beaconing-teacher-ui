package api

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"database/sql"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	jsoniter "github.com/json-iterator/go"

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

func SetupAPIHelper() {
	API = newAPIHelper()
}

func DoTimedRequestBody(method string, url string, reqBody io.Reader, timeout time.Duration) ([]byte, error) {
	// handle these method manually
	// for now without a context.
	if method == "POST" {
		response, err := http.Post(url, "application/json", reqBody)
		if err != nil {
			log.Println("POST!", err.Error())
			return []byte{}, err
		}

		defer response.Body.Close()
		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Println("POST!", err.Error())
			return []byte{}, err
		}
		return body, nil
	} else if method == "GET" {
		response, err := http.Get(url)
		if err != nil {
			log.Println("GET!", err.Error())
			return []byte{}, err
		}

		defer response.Body.Close()
		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Println("GET!", err.Error())
			return []byte{}, err
		}
		return body, nil
	}

	ctx, _ := context.WithTimeout(context.Background(), timeout)
	req, err := http.NewRequest(method, url, reqBody)
	log.Println("Doing HTTP request ", req)

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

// request with no body?
func DoTimedRequest(method string, url string, timeout time.Duration) ([]byte, error) {
	data, err := DoTimedRequestBody(method, url, nil, timeout)
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
func GetUserID(s *gin.Context) int {
	obj, _ := GetCurrentUser(s)
	if obj == nil {
		return -1
	}
	return obj.Id
}

// getPath creates an API path, appending on the given beaconing URL
// "https://core.beaconing.eu/api/", this makes concatenation painless
// as well as it slaps the access token on the end
func (a *CoreAPIManager) getPath(s *gin.Context, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s?access_token=%s", path, GetAccessToken(s))
}

func GetCurrentUser(s *gin.Context) (*types.CurrentUser, string) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "currentuser"), 5*time.Second)
	if err != nil {
		log.Println("GetCurrentUser", err.Error())
		return nil, ""
	}

	data := &types.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, data); err != nil {
		log.Println("GetCurrentUser", err.Error())
	}

	input := fmt.Sprintf("%d%s", data.Id, data.Username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))
	data.IdenticonSha512 = base64.StdEncoding.EncodeToString(hmac512.Sum(nil))

	modifiedJSON, err := jsoniter.Marshal(data)
	if err != nil {
		log.Println("GetCurrentUser", err.Error())
		// error, return old json
		return data, string(resp)
	}

	return data, string(modifiedJSON)
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

	var sslMode string = "verify-full"
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
