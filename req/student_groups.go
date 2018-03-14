package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/paths"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentGroupRequest struct {
	route.SimpleManagedRoute
}

func (r *StudentGroupRequest) Post(s *serv.SessionContext) {
	body := api.CreateStudentPOST(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

// MOVE me into the api layer!
func (r *StudentGroupRequest) Delete(s *serv.SessionContext) {
	// TODO sanitise
	idString := s.Param("id")
	id, err := strconv.ParseInt(idString, 10, 64)
	if err != nil || id < 0 {
		log.Println("StudentGroupRequest", err.Error())
		// TODO handle this properly
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, "Oh dear there was some error thing!")
		return
	}

	body := api.DeleteStudentGroup(s, id)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func (r *StudentGroupRequest) Get(s *serv.SessionContext) {
	body := api.GetStudentGroups(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func NewStudentGroupRequest(p paths.PathSet) *StudentGroupRequest {
	req := &StudentGroupRequest{}
	req.SetPaths(p)
	return req
}
