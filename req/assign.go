package req

import (
	"encoding/gob"
	"log"
	"strconv"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-contrib/sessions"
)

func init() {
	gob.Register(map[int]bool{})
}

type AssignRequest struct {
	route.SimpleManagedRoute
}

func (a *AssignRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("student")
	studentIDValue, err := strconv.Atoi(studentID)
	if err != nil || studentIDValue < 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid student ID")
		return
	}

	glpID := s.Param("glp")
	glpIDValue, err := strconv.Atoi(glpID)
	if err != nil || glpIDValue < 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

	// register the GLP in the session
	registerGLP(s, glpIDValue)

	// do the post request to the beaconing API
	// saying we're assigning said student to glp.
	resp, err := api.AssignStudentToGLP(s, studentIDValue, glpIDValue)
	if err != nil {
		s.SimpleErrorRedirect(400, "Failed to assign student to glp")
		return
	}
	s.Json(resp)
}

// registerGLP...
// this is a temporary demo thing, basically when we assign
// a glp, we store it in a hash set
func registerGLP(s *serv.SessionContext, glpID int) {
	session := sessions.Default(s.Context)

	assignedPlans := session.Get("assigned_plans")

	if assignedPlans == nil {
		log.Println("session assigned_plans doesn't exist")
	}

	assignedPlansTable := map[int]bool{}
	if assignedPlans != nil {
		log.Println("restoring old ALP assignments table from session")
		assignedPlansTable, _ = assignedPlans.(map[int]bool)
	}

	// TODO: if we want to sort by time we should probably
	// do this here, as well as we need to store the current time
	// right now because there is no time.

	// because we dont want to store duplicates we
	// store these in a hashset-type thing
	assignedPlansTable[glpID] = true

	session.Set("assigned_plans", assignedPlansTable)
	if err := session.Save(); err != nil {
		log.Println(err.Error())
	}
}

func NewAssignRequest(path string) *AssignRequest {
	req := &AssignRequest{}
	req.SetPath(path)
	return req
}
