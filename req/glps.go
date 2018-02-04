package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type GLPSRequest struct {
	route.SimpleManagedRoute
}

func (a *GLPSRequest) Handle(s *serv.SessionContext) {
	json := api.GetGamifiedLessonPlans(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, json)
}

func NewGLPSRequest(path string) *GLPSRequest {
	req := &GLPSRequest{}
	req.SetPath(path)
	return req
}
