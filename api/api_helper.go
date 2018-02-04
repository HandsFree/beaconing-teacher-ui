package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jsoniter "github.com/json-iterator/go"

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

var Api *ApiHelper = newApiHelper()

type ApiCache struct {
	// this probably isnt needed because if cacheData is
	// being invoked then it's always going to be new data
	// but we'll leave this here because I may implement it anyways
	LastCache map[string]time.Time
	Data      map[string]string
}

func cacheData(bucket string, data string) {
	Api.cache.Data[bucket] = data
}

// Fetch...
// checks the cache if the given value is present
// an empty string is returned if there is no value
func Fetch(bucket string) (string, bool) {
	if val, ok := Api.cache.Data[bucket]; ok {
		return val, true
	}
	return "", false
}

type ApiHelper struct {
	APIPath string
	cache   *ApiCache
}

// getPath...
// creates an API path, appending on the given beaconing URL
// "https://core.beaconing.eu/api/", this makes concatenation painless
// as well as it slaps the access token on the end
func (a *ApiHelper) getPath(s *serv.SessionContext, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s?access_token=%s", path, s.GetAccessToken())
}

// GetStudents...
//
func GetStudents(s *serv.SessionContext) string {
	response, err := http.Get(Api.getPath(s, "students"))
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	resp := string(body)
	cacheData("students", resp)
	return resp
}

// GetGamifiedLessonPlans...
//
//
func GetGamifiedLessonPlans(s *serv.SessionContext) string {
	response, err := http.Get(Api.getPath(s, "gamifiedlessonpaths"))
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	resp := string(body)
	cacheData("glps", resp)
	return resp
}

// AssignStudentToGLP...
//
//
func AssignStudentToGLP(s *serv.SessionContext, studentID int, glpID int) (string, error) {
	type assignment struct {
		StudentID int
		GlpID     int
	}

	assign := &assignment{studentID, glpID}

	assignJSON, err := jsoniter.Marshal(assign)
	if err != nil {
		return "", err
	}

	response, err := http.Post(Api.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps"), "application/json", bytes.NewBuffer(assignJSON))
	defer response.Body.Close()
	if err != nil {
		return "", err
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// GetGamifiedLessonPlan
// TODO: filter the useless stuff out of
// the glp json
func GetGamifiedLessonPlan(s *serv.SessionContext, id int) (string, *types.GamifiedLessonPlan) {
	response, err := http.Get(Api.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)))
	if err != nil {
		log.Println(err.Error())
		return "", nil
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return "", nil
	}

	data := &types.GamifiedLessonPlan{}
	if err := jsoniter.Unmarshal(body, data); err != nil {
		log.Println(err.Error())
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, body); err != nil {
		log.Println(err.Error())
	}

	return buffer.String(), data
}

func newApiCache() *ApiCache {
	return &ApiCache{
		LastCache: map[string]time.Time{},
		Data:      map[string]string{},
	}
}

func newApiHelper() *ApiHelper {
	// TODO: we can store this in the toml config
	return &ApiHelper{
		APIPath: "https://core.beaconing.eu/api/",
		cache:   newApiCache(),
	}
}
