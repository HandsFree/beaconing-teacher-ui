package api

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GetStudents requests a list of all students from the
// core api, returned as a string of json
// NOTE: because we have to inject the avatars in the json
// query here ourselves this is slower since we have to turn
// the json into structures to extract student id's then we
// have to regenerate the json with the new avatar hash slapped in.
//
// one thing I want to do is extract all the id's from the json
// then we can do one big query to the database asking for all of the ids
func GetStudents(s *gin.Context) (string, error) {
	resp, err, status := DoTimedRequest(s, "GET", API.getPath(s, "students"))
	if err != nil {
		util.Error("GetStudents", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[GetStudents] Status Returned: ", status)
		return "", nil
	}

	students := []*entity.Student{}
	if err := jsoniter.Unmarshal(resp, &students); err != nil {
		util.Error("GetStudents", err.Error(), "resp was", string(resp))
		return "", err
	}

	// TODO we could easily batch this into one SQL
	// query
	for _, student := range students {
		avatar, err := getUserAvatar(s, student.ID)
		if err != nil {
			util.Error("getUserAvatar", err.Error())

			avatar, err = setUserAvatar(s, student.ID, student.Username)
			if err != nil {
				util.Error("setUserAvatar", err.Error())
				avatar = "TODO identicon fall back here"
			}
		}
		student.IdenticonSha512 = avatar
	}

	modifiedStudentsJSON, err := jsoniter.Marshal(students)
	if err != nil {
		util.Error("GetStudents", err.Error())
		return string(resp), nil
	}

	body := string(modifiedStudentsJSON)
	if len(students) > 0 {
		cacheData("students", body)
	}
	return body, nil
}

// GetStudent returns the json object for the given student id
// note that it will store the hash object in the student and
// re-encode it. if anything fails, including hashing the avatar,
// this will return an empty string and an error.
func GetStudent(s *gin.Context, studentID int) (string, error) {
	data, err, status := DoTimedRequest(s, "GET", API.getPath(s, "students/", fmt.Sprintf("%d", studentID)))
	if err != nil {
		util.Error("GetStudent", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[GetStudent] Status Returned: ", status)
		return "", nil
	}

	// turn into json and slap in the student encoding hash
	// thing!
	// FIXME/TODO this is stupid and slower!!
	student := &entity.Student{}
	if err := jsoniter.Unmarshal(data, student); err != nil {
		util.Error("GetStudent", err.Error())
		return "", err
	}

	input := fmt.Sprintf("%d%s", student.ID, student.Username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))
	student.IdenticonSha512 = base64.StdEncoding.EncodeToString(hmac512.Sum(nil))

	encodedStudent, err := jsoniter.Marshal(student)
	if err != nil {
		util.Error("GetStudents", err.Error())
		return "", nil
	}

	return string(encodedStudent), nil
}

// PostStudent handles the POST student request route.
func PostStudent(s *gin.Context) (string, error) {
	var json *entity.StudentPost
	if err := s.ShouldBindJSON(&json); err != nil {
		util.Error("PostStudent", err.Error())
		return "", err
	}

	postStudent, err := jsoniter.Marshal(json)
	if err != nil {
		util.Error("PostStudent", err.Error())
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "POST",
		API.getPath(s, "students"),
		bytes.NewBuffer(postStudent),
	)

	if err != nil {
		util.Error("PostStudent", err.Error())
		return "", err
	}

	if status != http.StatusCreated {
		util.Info("[PostStudent] Status Returned: ", status)
		return "", nil
	}

	currUserID, err := GetUserID(s)
	if err != nil {
		util.Error("No such user", err.Error())
		return string(resp), err
	}

	API.WriteActivity(currUserID, activity.CreateStudentActivity, resp)
	return string(resp), nil
}

// PutStudent handles the PUT student api route
func PutStudent(s *gin.Context, studentID int) (string, error) {
	var json *entity.StudentPost
	if err := s.ShouldBindJSON(&json); err != nil {
		util.Error("PutStudent", err.Error())
		return "", err
	}

	putStudent, err := jsoniter.Marshal(json)
	if err != nil {
		util.Error("PutStudent", err.Error())
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "PUT",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID)),
		bytes.NewBuffer(putStudent),
	)

	if err != nil {
		util.Error("PutStudent", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[PutStudent] Status Returned: ", status)
		return "", nil
	}

	fmt.Println(string(resp))

	return string(resp), nil
}

// DeleteStudent handles the delete student request
func DeleteStudent(s *gin.Context, studentID int) (string, error) {
	data, err, status := DoTimedRequest(s, "DELETE",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID)),
	)

	if err != nil {
		util.Error("Delete Student", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[DeleteStudent] Status Returned: ", status)
		return "", nil
	}

	return string(data), nil
}
