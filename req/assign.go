package req

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"

	"github.com/gin-contrib/sessions"
	jsoniter "github.com/json-iterator/go"
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
	gob.Register(map[int]bool{})
}

type AssignRequest struct {
	route.SimpleManagedRoute
}

func (a *AssignRequest) Handle(s *serv.SessionContext) {
	studentID := s.Param("student")
	studentIDValue, err := strconv.Atoi(studentID)
	if err != nil || studentIDValue <= 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid student ID")
		return
	}

	glpID := s.Param("glp")
	glpIDValue, err := strconv.Atoi(glpID)
	if err != nil || glpIDValue <= 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

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
		assignedPlansTable[glpIDValue] = true

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
