package req

import (
	"bytes"
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"

	jsoniter "github.com/json-iterator/go"
)

type AssignRequest struct {
	route.SimpleManagedRoute
}

type AssignData struct {
	studentID string
	glpID     string
}

func NewAssignRequest(path string) *AssignRequest {
	req := &AssignRequest{}
	req.SetPath(path)
	return req
}

func (a *AssignData) assignGLP(accessToken string) (string, error) {
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

	strJSON := string(body)

	return strJSON, nil
}

func (a *AssignRequest) Handle(ctx *gin.Context) {
	studentID := ctx.Param("student")
	glpID := ctx.Param("glp")

	accessToken, keyDefined := a.GetServer().TokenStore.Get("access_token")
	if !keyDefined {
		ctx.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

	assignReqData := &AssignData{studentID, glpID}
	strJSON, err := assignReqData.assignGLP(accessToken)
	if err != nil {
		log.Fatal(err)
		return
	}

	ctx.Header("Content-Type", "application/json")
	ctx.String(http.StatusOK, strJSON)
}
