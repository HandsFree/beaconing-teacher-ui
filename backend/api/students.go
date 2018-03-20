package api

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/activities"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GetStudents requests a list of all students from the
// core api, returned as a string of json
func GetStudents(s *gin.Context) (string, error) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "students"), 5*time.Second)
	if err != nil {
		log.Println("GetStudents", err.Error())
		return "", err
	}

	students := []*types.Student{}
	if err := jsoniter.Unmarshal(resp, &students); err != nil {
		log.Println("GetStudents", err.Error())
		return "", err
	}

	// TODO we could easily batch this into one SQL
	// query
	for _, student := range students {
		avatar, err := getUserAvatar(s, student.Id)
		if err != nil {
			log.Println("getUserAvatar", err.Error())

			avatar, err = setUserAvatar(s, student.Id, student.Username)
			if err != nil {
				log.Println("setUserAvatar", err.Error())
				avatar = "TODO identicon fall back here"
			}
		}
		student.IdenticonSha512 = avatar
	}

	modifiedStudentsJSON, err := jsoniter.Marshal(students)
	if err != nil {
		log.Println("GetStudents", err.Error())
		return string(resp), nil
	}

	body := string(modifiedStudentsJSON)
	if len(students) > 0 {
		cacheData("students", body)
	}
	return body, nil
}

// GetStudent returns a decoded object as well as the json response
// of the given student of id {studentID}
func GetStudent(s *gin.Context, studentID int) (*types.Student, error) {
	data, err := DoTimedRequest("GET", API.getPath(s, "students/", fmt.Sprintf("%d", studentID)), 5*time.Second)
	if err != nil {
		log.Println("GetStudent", err.Error())
		return nil, err
	}

	student := &types.Student{}
	if err := jsoniter.Unmarshal(data, student); err != nil {
		log.Println("GetStudent", err.Error())
		return nil, err
	}

	input := fmt.Sprintf("%d%s", student.Id, student.Username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))
	student.IdenticonSha512 = base64.StdEncoding.EncodeToString(hmac512.Sum(nil))

	return student, nil
}

type studentPost struct {
	Id       uint   `json:"id"`
	Username string `json:"username"`
	Profile  string `json:"profile"`
}

func PostStudent(s *gin.Context) (string, error) {
	var json studentPost
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("PostStudent", err.Error())
		return "", err
	}

	postStudent, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("PostStudent", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody("POST",
		API.getPath(s, "students"),
		bytes.NewBuffer(postStudent),
		5*time.Second)
	if err != nil {
		log.Println("PostStudent", err.Error())
		return "", err
	}

	currUserId, err := GetUserID(s)
	if err != nil {
		log.Println("No such user", err.Error())
		return string(resp), err
	}

	API.WriteActivity(currUserId, activities.CreateStudentActivity, resp)
	return string(resp), nil
}
