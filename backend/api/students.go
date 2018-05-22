package api

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"fmt"
	"log"

	"git.juddus.com/HFC/beaconing/backend/activities"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GetStudents requests a list of all students from the
// core api, returned as a string of json
func GetStudents(s *gin.Context) (string, error) {
	resp, err := DoTimedRequest(s, "GET", API.getPath(s, "students"))
	if err != nil {
		log.Println("GetStudents", err.Error())
		return "", err
	}

	students := []*types.Student{}
	if err := jsoniter.Unmarshal(resp, &students); err != nil {
		log.Println("GetStudents", err.Error(), "resp was", string(resp))
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
	data, err := DoTimedRequest(s, "GET", API.getPath(s, "students/", fmt.Sprintf("%d", studentID)))
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

func PostStudent(s *gin.Context) (string, error) {
	var json *types.StudentPost
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("PostStudent", err.Error())
		return "", err
	}

	postStudent, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("PostStudent", err.Error())
		return "", err
	}

	log.Println(string(postStudent))

	resp, err := DoTimedRequestBody(s, "POST",
		API.getPath(s, "students"),
		bytes.NewBuffer(postStudent),
	)
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

func PutStudent(s *gin.Context, studentID int) (string, error) {
	var json *types.StudentPost
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("PutStudent", err.Error())
		return "", err
	}

	putStudent, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("PutStudent", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "PUT",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID)),
		bytes.NewBuffer(putStudent),
	)
	if err != nil {
		log.Println("PutStudent", err.Error())
		return "", err
	}

	fmt.Println(string(resp))

	return string(resp), nil
}

func DeleteStudent(s *gin.Context, studentID int) (string, error) {
	data, err := DoTimedRequest(s, "DELETE",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID)),
	)

	if err != nil {
		log.Println("Delete Student", err.Error())
		return "", err
	}

	return string(data), nil
}
