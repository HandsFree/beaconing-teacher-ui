package req

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentsRequest struct {
	route.SimpleManagedRoute
}

func (r *StudentsRequest) Post(s *serv.SessionContext) {}

func (r *StudentsRequest) Delete(s *serv.SessionContext) {
	studentID := s.Param("id")
	glpID := s.Param("glp")

	accessToken := s.GetAccessToken()

	clnt := &http.Client{}

	// TODO sanitise
	req, err := http.NewRequest("DELETE", fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps/%s?access_token=%s", studentID, glpID, accessToken), nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	resp, err := clnt.Do(req)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))

}

func (r *StudentsRequest) Get(s *serv.SessionContext) {
	resp := api.GetStudents(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, resp)
}

func NewStudentsRequest(paths map[string]string) *StudentsRequest {
	req := &StudentsRequest{}
	req.SetPaths(paths)
	return req
}
