package api

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"database/sql"

	_ "github.com/lib/pq"

	jsoniter "github.com/json-iterator/go"

	"git.juddus.com/HFC/beaconing/cfg"
	"git.juddus.com/HFC/beaconing/serv"
	"git.juddus.com/HFC/beaconing/types"
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

type apiCache struct {
	// this probably isnt needed because if cacheData is
	// being invoked then it's always going to be new data
	// but we'll leave this here because I may implement it anyways
	LastCache map[string]time.Time
	Data      map[string]string
}

func cacheData(bucket string, data string) {
	API.cache.Data[bucket] = data
}

// Fetch checks the cache if the given value is present
// an empty string is returned if there is no value
func Fetch(bucket string) (string, bool) {
	if val, ok := API.cache.Data[bucket]; ok {
		return val, true
	}
	return "", false
}

func DoTimedRequestBody(method string, url string, reqBody io.Reader, timeout time.Duration) ([]byte, error) {
	ctx, _ := context.WithTimeout(context.Background(), timeout)
	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return []byte{}, err
	}

	resp, err := http.DefaultClient.Do(req.WithContext(ctx))
	if err != nil {
		return []byte{}, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
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

// getUserID returns the current users id number, if there is no
// current user session it returns -1
func GetUserID(s *serv.SessionContext) int {
	obj, _ := GetCurrentUser(s)
	if obj == nil {
		return -1
	}
	return obj.Id
}

// getPath creates an API path, appending on the given beaconing URL
// "https://core.beaconing.eu/api/", this makes concatenation painless
// as well as it slaps the access token on the end
func (a *CoreAPIManager) getPath(s *serv.SessionContext, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s?access_token=%s", path, s.GetAccessToken())
}

func GetCurrentUser(s *serv.SessionContext) (*types.CurrentUser, string) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "currentuser"), 5*time.Second)
	if err != nil {
		log.Println(err.Error())
		return nil, ""
	}

	data := &types.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, data); err != nil {
		log.Println(err.Error())
	}

	return data, string(resp)
}

func newAPICache() *apiCache {
	return &apiCache{
		LastCache: map[string]time.Time{},
		Data:      map[string]string{},
	}
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
