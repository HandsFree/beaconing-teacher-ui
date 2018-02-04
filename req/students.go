package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentsRequest struct {
	route.SimpleManagedRoute
}

func (r *StudentsRequest) Handle(s *serv.SessionContext) {
	resp := api.GetStudents(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, resp)
}

func NewStudentsRequest(path string) *StudentsRequest {
	req := &StudentsRequest{}
	req.SetPath(path)
	return req
}
