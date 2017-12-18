package req

import (
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
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

	strJSON := string(body)

	return strJSON, nil
}

func NewStudentRequest(path string) *StudentRequest {
	req := &StudentRequest{}
	req.SetPath(path)
	return req
}

func (r *StudentRequest) Handle(ctx *gin.Context, s *serv.BeaconingServer) {
	studentID := ctx.Param("id")
	action := ctx.Param("action")

	fmt.Println(action)

	accessToken, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		ctx.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
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

	ctx.Header("Content-Type", "application/json")
	ctx.String(http.StatusOK, strJSON)
}
