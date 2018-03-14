package api

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"fmt"
	"log"
	"time"

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

	for _, s := range students {
		input := fmt.Sprintf("%d%s", s.Id, s.Username)
		hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
		hmac512.Write([]byte(input))
		s.IdenticonSha512 = base64.StdEncoding.EncodeToString(hmac512.Sum(nil))
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
func GetStudent(s *gin.Context, studentID int) (*types.Student, string) {
	data, err := DoTimedRequest("GET", API.getPath(s, "students/", fmt.Sprintf("%d", studentID)), 5*time.Second)
	if err != nil {
		log.Println("GetStudent", err.Error())
		return nil, ""
	}

	student := &types.Student{}
	if err := jsoniter.Unmarshal(data, student); err != nil {
		log.Println("GetStudent", err.Error())
	}

	input := fmt.Sprintf("%d%s", student.Id, student.Username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))
	student.IdenticonSha512 = base64.StdEncoding.EncodeToString(hmac512.Sum(nil))

	return student, string(data)
}
