package req

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type TokenRequest struct {
	route.SimpleManagedRoute
}

func (r *TokenRequest) Handle(s *serv.SessionContext) {
	accessToken := s.Query("code")
	if accessToken == "" {
		s.String(400, "Error: Access Token not provided")
		return
	}

	session := sessions.Default(s.Context)

	// TODO: needs sanitisation
	session.Set("access_token", accessToken)

	if err := s.TryRefreshToken(); err != nil {
		log.Fatal(err)
		s.String(500, "Server Error: 500 Token Refresh Failed")
		return
	}

	if err := session.Save(); err != nil {
		log.Fatal(err)
		return
	}

	redirectPath := session.Get("last_path")
	if redirectPath == nil {
		s.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	s.Redirect(http.StatusTemporaryRedirect, redirectPath.(string))
}

func NewTokenRequest(path string) *TokenRequest {
	req := &TokenRequest{}
	req.SetPath(path)
	return req
}
