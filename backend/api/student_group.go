package api

import (
	"bytes"
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/serv"
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
		log.Println("CreateStudentPOST", err.Error())
		return ""
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("CreateStudentPOST", err.Error())
		return ""
	}

	resp, err := DoTimedRequestBody("POST",
		API.getPath(s, "studentgroups"),
		bytes.NewBuffer(studentGroupPost),
		5*time.Second)

	API.WriteActivity(GetUserID(s), Create_Student, resp)
	return string(resp)
}

func GetStudentGroups(s *serv.SessionContext) string {
	resp, err := DoTimedRequest("GET", API.getPath(s, "studentgroups"), 5*time.Second)
	if err != nil {
		log.Println("CreateStudentGroups", err.Error())
		return ""
	}
	return string(resp)
}

func DeleteStudentGroup(s *serv.SessionContext, id int64) string {
	req, err := DoTimedRequest("DELETE",
		API.getPath(s,
			"studentgroups/",
			fmt.Sprintf("%d", id)),
		5*time.Second)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	return string(req)
}
