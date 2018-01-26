package req

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	jsoniter "github.com/json-iterator/go"
)

type AssignRequest struct {
	route.SimpleManagedRoute
}

func NewAssignRequest(path string) *AssignRequest {
	req := &AssignRequest{}
	req.SetPath(path)
	return req
}

type assignData struct {
	studentID string
	glpID     string
}

func (a *assignData) assignGLP(accessToken string) (string, error) {
	assignJSON, err := jsoniter.Marshal(a)
	if err != nil {
		return "", err
	}

	// TODO replace with a CONST URL
	postURL := fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", a.studentID, accessToken)
	response, err := http.Post(postURL, "application/json", bytes.NewBuffer(assignJSON))
	if err != nil {
		return "", err
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func (a *AssignRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("student")
	glpID := s.Param("glp")

	accessToken := s.TryAuth(a.GetPath())

	assignReqData := &assignData{studentID, glpID}
	assignReq, err := assignReqData.assignGLP(accessToken)
	if err != nil {
		log.Fatal(err)
		return
	}

	s.Json(assignReq)
}
