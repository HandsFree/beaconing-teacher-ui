package req

import (
	"fmt"
	"io/ioutil"
	"log"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	"net/http"
	"strconv"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

func (r *GLPRequest) Post(s *serv.SessionContext) {

}

func (r *GLPRequest) Delete(s *serv.SessionContext) {
	// TODO sanitise
	id := s.Query("id")

	accessToken := s.GetAccessToken()

	response, err := http.NewRequest("DELETE", fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths/%s?access_token=%s", id, accessToken), nil)
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

func (a *GLPRequest) Get(s *serv.SessionContext) {
	glpID := s.Param("id")
	glpIDValue, err := strconv.Atoi(glpID)
	if err != nil || glpIDValue < 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

	json, _ := api.GetGamifiedLessonPlan(s, glpIDValue)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, json)
}

func NewGLPRequest(paths map[string]string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPaths(paths)
	return req
}
