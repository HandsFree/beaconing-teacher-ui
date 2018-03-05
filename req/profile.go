package req

import (
	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"net/http"
)

type ProfileRequest struct {
	route.SimpleManagedRoute
}

func (r *ProfileRequest) Post(s *serv.SessionContext)   {}
func (r *ProfileRequest) Delete(s *serv.SessionContext) {}

func (r *ProfileRequest) Get(s *serv.SessionContext) {
	_, resp := api.GetCurrentUser(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, resp)
}

func NewProfileRequest(path string) *ProfileRequest {
	req := &ProfileRequest{}
	req.SetPath(path)
	return req
}
