package req

import (
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"io/ioutil"
	"log"
	"net/http"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

type glpData struct {
	id           int
	name         string
	desc         string
	author       string
	category     string
	content      string
	gamePlotId   int
	externConfig string
}

func NewGLPRequest(path string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPath(path)
	return req
}

func (a *GLPRequest) Handle(ctx *gin.Context, s *serv.BeaconingServer) {
	// what does this mean elliot!!
	// Needs filtering
	glpID := ctx.Param("id")

	accessToken, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		ctx.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths/%s?access_token=%s", glpID, accessToken))
	if err != nil {
		log.Fatal(err)
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
		return
	}

	data := glpData{}
	if err := jsoniter.Unmarshal(body, &data); err != nil {
		panic(err)
	}

	strJSON := string(body)
	ctx.Header("Content-Type", "application/json")
	ctx.String(http.StatusOK, strJSON)
}
