package api

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/serv"
	jsoniter "github.com/json-iterator/go"
)

type StudentGroupPost struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

// this is technically creating a student group!
// fixme
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
