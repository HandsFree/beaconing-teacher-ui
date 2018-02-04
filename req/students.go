package req

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentsRequest struct {
	route.SimpleManagedRoute
}

func (r *StudentsRequest) Handle(s *serv.SessionContext) {
	accessToken := s.GetAccessToken()

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students?access_token=%s", accessToken))
	if err != nil {
		log.Fatal(err)
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
		return
	}

	strJSON := string(body)

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, strJSON)
}

// ────────────────────────────────────────────────────────────────────────────────

func NewStudentsRequest(path string) *StudentsRequest {
	req := &StudentsRequest{}
	req.SetPath(path)
	return req
}
