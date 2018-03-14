package req

import (
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/paths"
	"git.juddus.com/HFC/beaconing/backend/route"
	"git.juddus.com/HFC/beaconing/backend/serv"
)

// intent/students/assigned
type AssignedGLPsRequest struct {
	route.SimpleManagedRoute
}

func (r *AssignedGLPsRequest) Post(s *serv.SessionContext) {}

func (r *AssignedGLPsRequest) Delete(s *serv.SessionContext) {
	studentIDParam := s.Param("id")
	studentID, err := strconv.Atoi(studentIDParam)
	if err != nil {
		s.SimpleErrorRedirect(500, "No such ID thing!")
		return
	}

	glpIDParam := s.Param("glp")
	glpID, err := strconv.Atoi(glpIDParam)
	if err != nil {
		s.SimpleErrorRedirect(500, "No such ID thing!")
		return
	}

	body := api.DeleteAssignedGLP(s, studentID, glpID)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func (r *AssignedGLPsRequest) Get(s *serv.SessionContext) {
	studentIDParam := s.Param("id")
	studentID, err := strconv.Atoi(studentIDParam)
	if err != nil {
		s.SimpleErrorRedirect(500, "No such ID thing!")
		return
	}

	body := api.GetAssignedGLPS(s, studentID)
	s.Json(body)
}

func NewAssignedGLPsRequest(p paths.PathSet) *AssignedGLPsRequest {
	req := &AssignedGLPsRequest{}
	req.SetPaths(p)
	return req
}
