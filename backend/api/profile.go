package api

import (
	"bytes"
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// PutProfile handles the put profile api request
func PutProfile(s *gin.Context) (string, error) {
	var json *types.CurrentUser
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	profilePut, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "PUT",
		API.getPath(s, "currentuser"),
		bytes.NewBuffer(profilePut),
	)
	if err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	// todo is this an activity or not?
	return string(resp), nil
}
