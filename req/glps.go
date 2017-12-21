package req

import (
	"fmt"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"io/ioutil"
	"log"
	"net/http"
)

type GLPSRequest struct {
	route.SimpleManagedRoute
}

func NewGLPSRequest(path string) *GLPSRequest {
	req := &GLPSRequest{}
	req.SetPath(path)
	return req
}

func (a *GLPSRequest) Handle(s *serv.SessionContext) {
	accessToken, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths?access_token=%s", accessToken))
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
