package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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

var Api *ApiHelper = NewApiHelper()

type ApiHelper struct {
	APIPath string
	cache   ApiCache
}

func (a *ApiHelper) getPath(s *serv.SessionContext, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s?access_token=%s", path, s.GetAccessToken())
}

func GetStudents(s *serv.SessionContext) string {
	response, err := http.Get(Api.getPath(s, "students"))
	if err != nil {
		log.Println(err)
		return ""
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
		return ""
	}

	return string(body)
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

	return string(body)
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
		log.Fatal(err)
		return "", nil
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
		return "", nil
	}

	data := &types.GamifiedLessonPlan{}
	if err := jsoniter.Unmarshal(body, data); err != nil {
		log.Println(err)
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, body); err != nil {
		log.Println(err)
	}

	return buffer.String(), data
}

func NewApiHelper() *ApiHelper {
	// TODO: we can store this in the toml config
	return &ApiHelper{
		APIPath: "https://core.beaconing.eu/api/",
	}
}
