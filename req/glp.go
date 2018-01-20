package req

import (
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-contrib/sessions"
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

// TODO: filter the useless stuff out of
// the glp json
func (a *GLPRequest) Handle(s *serv.SessionContext) {
	glpID := s.Param("id")

	session := sessions.Default(s.Context)

	accessToken := session.Get("access_token")
	if accessToken == nil {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths/%s?access_token=%s", glpID, accessToken.(string)))
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
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, strJSON)
}
