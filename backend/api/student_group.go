package api

import (
	"bytes"
	"fmt"
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activity"
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
		log.Println("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "POST",
		API.getPath(s, "studentgroups"),
		bytes.NewBuffer(studentGroupPost),
	)
	if err != nil {
		log.Println("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	id, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return string(resp), err
	}

	API.WriteActivity(id, activity.CreateStudentGroupActivity, resp)
	return string(resp), nil
}

// GetStudentGroups gets all of the student groups
// currently registered.
func GetStudentGroups(s *gin.Context) (string, error) {
	resp, err := DoTimedRequest(s, "GET", API.getPath(s, "studentgroups"))
	if err != nil {
		log.Println("GetStudentGroups", err.Error())
		return "", err
	}
	return string(resp), nil
}

// GetStudentGroup gets all of the student groups
// currently registered.
func GetStudentGroup(s *gin.Context, groupID int) (string, error) {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID)),
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
	req, err := DoTimedRequest(s, "DELETE",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", id)),
	)
	if err != nil {
		log.Println("DeleteStudentGroup", err.Error())
		return "", err
	}

	currUserID, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return string(req), err
	}

	API.WriteActivity(currUserID, activity.DeleteStudentGroupActivity, req)
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

	resp, err := DoTimedRequestBody(s, "PUT",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID)),
		bytes.NewBuffer(putJSON),
	)

	if err != nil {
		log.Println("PutStudentGroup TimedRequest", err.Error())
		return "", err
	}

	return string(resp), nil
}
