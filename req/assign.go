package req

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	"github.com/gin-contrib/sessions"
	jsoniter "github.com/json-iterator/go"
)

// handles the assignment of a GLP

type assignData struct {
	studentID string
	glpID     string
}

// submits this assignment data to
// the api
func (a *assignData) submit(accessToken string) (string, error) {
	assignJSON, err := jsoniter.Marshal(a)
	if err != nil {
		return "", err
	}

	// TODO replace with a CONST URL
	postURL := fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", a.studentID, accessToken)
	response, err := http.Post(postURL, "application/json", bytes.NewBuffer(assignJSON))
	if err != nil {
		return "", err
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

type AssignRequest struct {
	route.SimpleManagedRoute
}

func (a *AssignRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("student")
	glpID := s.Param("glp")

	accessToken := s.GetAccessToken(a.GetPath())

	assignReqData := assignData{studentID, glpID}

	{
		// temporary. store in the session for now.
		session := sessions.Default(s.Context)

		assignedPlans := session.Get("assigned_plans")

		var assignedPlansTable []assignData

		// no table in the session so we create one
		if assignedPlans == nil {
			// create a new table.
			assignedPlansTable = []assignData{}
		} else {
			assignedPlansTable = assignedPlans.([]assignData)
		}

		// TODO: if we want to sort by time we should probably
		// do this here, as well as we need to store the current time
		// right now because there is no time.

		// add our assignment to the table
		assignedPlansTable = append(assignedPlansTable, assignReqData)

		session.Set("assigned_plans", assignedPlansTable)
		session.Save()
	}

	assignReq, err := assignReqData.submit(accessToken)
	if err != nil {
		log.Fatal(err)
		return
	}

	s.Json(assignReq)
}

func NewAssignRequest(path string) *AssignRequest {
	req := &AssignRequest{}
	req.SetPath(path)
	return req
}
