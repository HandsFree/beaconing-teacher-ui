package api

import (
	"bytes"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type studentGroupPostJSON struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// CreateStudentGroup creates a new student group
// as a post request with the given information
// defined above in {studentGroupPostJSON}.
func CreateStudentGroup(s *gin.Context) string {
	var json studentGroupPostJSON
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

	API.WriteActivity(GetUserID(s), CreateStudent, resp)
	return string(resp)
}

// GetStudentGroups gets all of the student groups
// currently registered.
func GetStudentGroups(s *gin.Context) string {
	resp, err := DoTimedRequest("GET", API.getPath(s, "studentgroups"), 5*time.Second)
	if err != nil {
		log.Println("CreateStudentGroups", err.Error())
		return ""
	}
	return string(resp)
}

// DeleteStudentGroup deletes a specific student group of
// the given id {id}.
func DeleteStudentGroup(s *gin.Context, id int64) string {
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
