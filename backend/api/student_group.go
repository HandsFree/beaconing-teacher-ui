package api

import (
	"bytes"
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/activities"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type groupStudent struct {
	ID int `json:"id"`
}

type studentGroupPostJSON struct {
	ID       int            `json:"id"`
	Name     string         `json:"name"`
	Category string         `json:"category"`
	Students []groupStudent `json:"students"`
}

// CreateStudentGroup creates a new student group
// as a post request with the given information
// defined above in {studentGroupPostJSON}.
func CreateStudentGroup(s *gin.Context) (string, error) {
	var json studentGroupPostJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("CreateStudentPOST", err.Error())
		return "", err
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("CreateStudentPOST", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody("POST",
		API.getPath(s, "studentgroups"),
		bytes.NewBuffer(studentGroupPost),
		5*time.Second)
	if err != nil {
		log.Println("CreateStudentPOST", err.Error())
		return "", err
	}

	id, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return string(resp), err
	}

	API.WriteActivity(id, activities.CreateStudentGroupActivity, resp)
	return string(resp), nil
}

// GetStudentGroups gets all of the student groups
// currently registered.
func GetStudentGroups(s *gin.Context) (string, error) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "studentgroups"), 5*time.Second)
	if err != nil {
		log.Println("GetStudentGroups", err.Error())
		return "", err
	}
	return string(resp), nil
}

// GetStudentGroup gets all of the student groups
// currently registered.
func GetStudentGroup(s *gin.Context, groupID int) (string, error) {
	resp, err := DoTimedRequest(
		"GET",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID)),
		5*time.Second,
	)

	if err != nil {
		log.Println("GetStudentGroup", err.Error())
		return "", err
	}

	return string(resp), nil
}

// DeleteStudentGroup deletes a specific student group of
// the given id {id}.
func DeleteStudentGroup(s *gin.Context, id int64) (string, error) {
	req, err := DoTimedRequest("DELETE",
		API.getPath(s,
			"studentgroups/",
			fmt.Sprintf("%d", id)),
		5*time.Second)
	if err != nil {
		log.Println("DeleteStudentGroup", err.Error())
		return "", err
	}

	currUserID, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return string(req), err
	}

	API.WriteActivity(currUserID, activities.DeleteStudentGroupActivity, req)
	return string(req), nil
}

// PutStudentGroup updates a student group
func PutStudentGroup(s *gin.Context, groupID int) (string, error) {
	var groupJSON studentGroupPostJSON
	if err := s.ShouldBindJSON(&groupJSON); err != nil {
		log.Println("PutStudentGroup shouldBind", err.Error())
		return "", err
	}

	putJSON, err := jsoniter.Marshal(groupJSON)
	if err != nil {
		log.Println("PutStudentGroup JSON marshal", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody(
		"PUT",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID)),
		bytes.NewBuffer(putJSON),
		5*time.Second,
	)

	if err != nil {
		log.Println("PutStudentGroup TimedRequest", err.Error())
		return "", err
	}

	return string(resp), nil
}
