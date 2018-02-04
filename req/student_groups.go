package req

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type StudentGroupRequest struct {
	route.SimpleManagedRoute
}

func (r *StudentGroupRequest) Handle(s *serv.SessionContext) {
	accessToken := s.GetAccessToken()

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/studentgroups?access_token=%s", accessToken))
	if err != nil {
		log.Println(err.Error())
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))
}

func NewStudentGroupRequest(path string) *StudentGroupRequest {
	req := &StudentGroupRequest{}
	req.SetPath(path)
	return req
}
