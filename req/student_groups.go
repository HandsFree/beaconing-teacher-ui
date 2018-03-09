package req

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/api"
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
		log.Println(err.Error())
		// TODO handle this properly
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, "Oh dear there was some error thing!")
		return
	}

	accessToken := s.GetAccessToken()

	clnt := &http.Client{}

	req, err := http.NewRequest("DELETE", fmt.Sprintf("https://core.beaconing.eu/api/studentgroups/%s?access_token=%s", id, accessToken), nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	resp, err := clnt.Do(req)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(body))
}

func (r *StudentGroupRequest) Get(s *serv.SessionContext) {
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

func NewStudentGroupRequest(paths map[string]string) *StudentGroupRequest {
	req := &StudentGroupRequest{}
	req.SetPaths(paths)
	return req
}
