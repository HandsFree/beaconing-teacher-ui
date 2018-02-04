package req

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type StudentGroupRequest struct {
	route.SimpleManagedRoute
}

// TODO move these to the API layer

type StudentGroupPost struct {
	Id   int
	Name string
}

func (r *StudentGroupRequest) Post(s *serv.SessionContext) {
	var json StudentGroupPost
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println(err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println(err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken := s.GetAccessToken()

	response, err := http.Post(fmt.Sprintf("https://core.beaconing.eu/api/studentgroups?access_token=%s", accessToken), "application/json", bytes.NewBuffer(studentGroupPost))
	if err != nil {
		log.Println(err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		log.Println(err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))
}

func (r *StudentGroupRequest) Delete(s *serv.SessionContext) {
	// TODO sanitise
	id := s.Query("id")

	accessToken := s.GetAccessToken()

	response, err := http.NewRequest("DELETE", fmt.Sprintf("https://core.beaconing.eu/api/studentgroups/%s?access_token=%s", id, accessToken), nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))
}

func (r *StudentGroupRequest) Get(s *serv.SessionContext) {
	accessToken := s.GetAccessToken()

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/studentgroups?access_token=%s", accessToken))
	if err != nil {
		log.Println(err.Error())
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))
}

func NewStudentGroupRequest(paths map[string]string) *StudentGroupRequest {
	req := &StudentGroupRequest{}
	req.SetPaths(paths)
	return req
}
