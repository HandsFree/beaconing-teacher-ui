package req

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/route"
	"git.juddus.com/HFC/beaconing/backend/serv"
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

func (r *TokenRequest) Post(s *serv.SessionContext)   {}
func (r *TokenRequest) Delete(s *serv.SessionContext) {}

func (r *TokenRequest) Get(s *serv.SessionContext) {
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

	if err := api.TryRefreshToken(s); err != nil {
		log.Println("TokenRequest", err.Error())
		s.SimpleErrorRedirect(500, "Server Error: 500 Token Refresh Failed")
		return
	}

	if err := session.Save(); err != nil {
		log.Println("TokenRequest", err.Error())
		s.SimpleErrorRedirect(500, "Failed to save session")
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
	req.SetGET(path)
	return req
}
