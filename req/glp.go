package req

import (
	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	"net/http"
	"strconv"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

func (a *GLPRequest) Handle(s *serv.SessionContext) {
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

func NewGLPRequest(path string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPath(path)
	return req
}
