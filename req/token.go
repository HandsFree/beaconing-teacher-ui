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

func isLetterOrDigit(c rune) bool {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
}

func isValidToken(tok string) bool {
	for _, r := range tok {
		if !isLetterOrDigit(r) {
			return false
		}
	}
	return true
}

func (r *TokenRequest) Handle(s *serv.SessionContext) {
	accessToken := s.Query("code")
	if accessToken == "" {
		s.SimpleErrorRedirect(400, "Error: Access Token not provided")
		return
	}

	session := sessions.Default(s.Context)

	if !isValidToken(accessToken) {
		s.SimpleErrorRedirect(400, "Client Error: Invalid access token")
	}
	session.Set("access_token", accessToken)

	if err := s.TryRefreshToken(); err != nil {
		log.Println(err.Error())
		s.SimpleErrorRedirect(500, "Server Error: 500 Token Refresh Failed")
		return
	}

	if err := session.Save(); err != nil {
		log.Println(err.Error())
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
