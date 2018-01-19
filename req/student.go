package req

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentRequest struct {
	route.SimpleManagedRoute
}

func getStudent(studentID string, accessToken string) (string, error) {
	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students/%s?access_token=%s", studentID, accessToken))
	if err != nil {
		return "", err
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	strJSON := string(body)

	return strJSON, nil
}

func getStudentGLPS(studentID string, accessToken string) (string, error) {
	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", studentID, accessToken))
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

func NewStudentRequest(path string) *StudentRequest {
	req := &StudentRequest{}
	req.SetPath(path)
	return req
}

func (r *StudentRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("id")
	action := s.Param("action")

	fmt.Println(action)

	accessToken, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

	var strJSON string

	switch action {
	case "/glps", "/glps/":
		response, err := getStudentGLPS(studentID, accessToken)
		if err != nil {
			log.Fatal(err)
			return
		}
		strJSON = response
	default:
		response, err := getStudent(studentID, accessToken)
		if err != nil {
			log.Fatal(err)
			return
		}
		strJSON = response
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, strJSON)
}
