package req

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	"github.com/gin-contrib/sessions"
	jsoniter "github.com/json-iterator/go"
	"github.com/olekukonko/tablewriter"
)

// handles the assignment of a GLP

type AssignData struct {
	StudentID string
	GlpID     string
}

// submits this assignment data to
// the api
func (a *AssignData) submit(accessToken string) (string, error) {
	assignJSON, err := jsoniter.Marshal(a)
	if err != nil {
		return "", err
	}

	// TODO replace with a CONST URL
	postURL := fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", a.StudentID, accessToken)
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

func init() {
	gob.Register(AssignData{})
	gob.Register([]AssignData{})
}

type AssignRequest struct {
	route.SimpleManagedRoute
}

func (a *AssignRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("student")
	glpID := s.Param("glp")

	accessToken := s.GetAccessToken(a.GetPath())

	assignReqData := AssignData{studentID, glpID}

	// TEMPORARY.
	// for now we store the assignments in a table in the
	// session. eventually this will be submitted to the API
	{
		session := sessions.Default(s.Context)

		assignedPlans := session.Get("assigned_plans")

		if assignedPlans == nil {
			log.Println("session assigned_plans doesn't exist")
		}

		assignedPlansTable := []AssignData{}
		if assignedPlans != nil {
			log.Println("restoring old ALP assignments table from session")
			assignedPlansTable, _ = assignedPlans.([]AssignData)
		}

		// TODO: if we want to sort by time we should probably
		// do this here, as well as we need to store the current time
		// right now because there is no time.

		// add our assignment to the table
		assignedPlansTable = append(assignedPlansTable, assignReqData)

		// pretty print a table with the data of the assign table
		{
			table := tablewriter.NewWriter(os.Stdout)
			table.SetHeader([]string{"student_id", "glp_id"})
			for _, assignment := range assignedPlansTable {
				table.Append([]string{assignment.StudentID, assignment.GlpID})
			}
			table.Render()
		}

		session.Set("assigned_plans", assignedPlansTable)
		if err := session.Save(); err != nil {
			log.Println(err.Error())
		}
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
