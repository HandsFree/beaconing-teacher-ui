package api

import (
	"bytes"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type putProfileJSON struct {
	Id              uint     `json:"id"`
	Username        string   `json:"username"`
	Email           string   `json:"email"`
	Language        string   `json:"language"`
	Roles           []string `json:"roles"`
	Accessibility   string   `json:"accessibility"`
	TeacherSettings string   `json:"teacherSettings"`
}

func PutProfile(s *gin.Context) (string, error) {
	var json putProfileJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	profilePut, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody("PUT",
		API.getPath(s, "currentuser"),
		bytes.NewBuffer(profilePut),
		5*time.Second)
	if err != nil {
		log.Println("PutProfile", err.Error())
		return "", err
	}

	// todo is this an activity or not?
	return string(resp), nil
}
