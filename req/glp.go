package req

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"git.juddus.com/HFC/beaconing/types"
	jsoniter "github.com/json-iterator/go"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

// TODO: filter the useless stuff out of
// the glp json
func (a *GLPRequest) Handle(s *serv.SessionContext) {
	glpID := s.Param("id")
	glpIDValue, err := strconv.Atoi(glpID)
	if err != nil || glpIDValue < 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

	accessToken := s.GetAccessToken(a.GetPath())

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

	data := types.GamifiedLessonPlan{}
	if err := jsoniter.Unmarshal(body, &data); err != nil {
		log.Println(err)
	}

	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, body); err != nil {
		log.Println(err)
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, buffer.String())
}

func NewGLPRequest(path string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPath(path)
	return req
}
