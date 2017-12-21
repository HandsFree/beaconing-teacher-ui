package req

import (
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"io/ioutil"
	"log"
	"net/http"
)

type StudentsRequest struct {
	route.SimpleManagedRoute
}

func NewStudentsRequest(path string) *StudentsRequest {
	req := &StudentsRequest{}
	req.SetPath(path)
	return req
}

func (r *StudentsRequest) Handle(s *serv.SessionContext) {
	accessToken, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

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
