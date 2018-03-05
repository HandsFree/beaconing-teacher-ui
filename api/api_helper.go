package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"database/sql"
	_ "github.com/lib/pq"

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

// API is the main instance to the api helper
// this performs any api requests necessary
var API = newAPIHelper()

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

func GetActivities(teacherID int, count int) []types.Activity {
	if teacherID == -1 {
		log.Println("Cannot fetch activities!")
		return []types.Activity{}
	}

	if API.db == nil {
		log.Println("-- No database connection has been established")
		return []types.Activity{}
	}

	query := "SELECT creation_date, activity_type, api_req FROM activities WHERE teacher_id = $2 LIMIT $1"
	rows, err := API.db.Query(query, count, teacherID)
	if err != nil {
		log.Println(err.Error())
		return []types.Activity{}
	}

	var activities []types.Activity
	var result types.Activity

	for rows.Next() {
		var creation_date time.Time
		var activity_type int
		var api_req []byte

		err = rows.Scan(&creation_date, &activity_type, &api_req)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!")
			continue
		}

		switch ActivityType(activity_type) {
		case Create_Student:
			result = &types.CreatedStudentActivity{}
		default:
			log.Println("Unhandled activity type", ActivityType(activity_type))
		}

		// shouldn't happen
		if result == nil {
			continue
		}

		log.Println("Loaded activity", result)

		activities = append(activities, result)
	}

	return activities
}

type ActivityType int

const (
	Create_Student ActivityType = iota
)

func (c *CoreAPIManager) WriteActivity(teacherID int, kind ActivityType, jsonData []byte) {
	if teacherID == -1 {
		log.Println("Cannot write activity for NULL user, skipping.")
		return
	}

	if c.db == nil {
		log.Println("-- No database connection has been established")
		return
	}

	// TODO store the activity type!

	query := "INSERT INTO activities (teacher_id, creation_date, activity_type, api_req) VALUES($1, $2, $3, $4)"
	_, err := c.db.Exec(query, teacherID, time.Now(), int(kind), jsonData)
	if err != nil {
		log.Println("-- ", err.Error())
	}
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

type StudentGroupPost struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func CreateStudentPOST(s *serv.SessionContext) string {
	var json StudentGroupPost
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println(err.Error())
		return ""
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	response, err := http.Post(API.getPath(s, "studentgroups"), "application/json", bytes.NewBuffer(studentGroupPost))
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	API.WriteActivity(GetUserID(s), Create_Student, body)

	return string(body)
}

// GetStudents requests a list of all students from the
// core api, returned as a string of json
func GetStudents(s *serv.SessionContext) string {
	response, err := http.Get(API.getPath(s, "students"))
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

func GetCurrentUser(s *serv.SessionContext) (*types.CurrentUser, string) {
	response, err := http.Get(API.getPath(s, "currentuser"))
	if err != nil {
		log.Println(err.Error())
		return nil, ""
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return nil, ""
	}

	data := &types.CurrentUser{}
	if err := jsoniter.Unmarshal(body, data); err != nil {
		log.Println(err.Error())
	}

	return data, string(body)
}

// GetGamifiedLessonPlans requests all of the GLPs from the core
// API returned as a json string
func GetGamifiedLessonPlans(s *serv.SessionContext) string {
	response, err := http.Get(API.getPath(s, "gamifiedlessonpaths"))
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

// AssignStudentToGLP assigns the given student (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
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

	response, err := http.Post(API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps"), "application/json", bytes.NewBuffer(assignJSON))
	if err != nil {
		return "", err
	}

	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// GetGamifiedLessonPlan requests the GLP with the given id, this function returns
// the string of json retrieved _as well as_ the parsed json object
// see types.GamifiedLessonPlan
func GetGamifiedLessonPlan(s *serv.SessionContext, id int) (string, *types.GamifiedLessonPlan) {
	response, err := http.Get(API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)))
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

func newAPICache() *apiCache {
	return &apiCache{
		LastCache: map[string]time.Time{},
		Data:      map[string]string{},
	}
}

func newAPIHelper() *CoreAPIManager {
	log.Println("-- Creating new API instance.")

	// TODO if we are in release mode use SSL!

	connStr := "user=felix dbname=beaconing sslmode=disable"
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
