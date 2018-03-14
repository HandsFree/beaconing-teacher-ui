package req

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing/backend/api"
)

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

func GetTokenRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		accessToken := s.Query("code")
		if accessToken == "" {
			s.String(http.StatusBadRequest, "Error: Access Token not provided")
			return
		}

		if !isValidToken(accessToken) {
			s.String(http.StatusBadRequest, "Client Error: Invalid access token")
			return
		}

		session := sessions.Default(s)
		session.Set("access_token", accessToken)

		if err := api.TryRefreshToken(s); err != nil {
			log.Println("TokenRequest", err.Error())
			s.String(http.StatusBadRequest, "Server Error: 500 Token Refresh Failed")
			return
		}

		if err := session.Save(); err != nil {
			log.Println("TokenRequest", err.Error())
			s.String(http.StatusBadRequest, "Failed to save session")
			return
		}

		redirectPath := session.Get("last_path")
		if redirectPath == nil {
			s.Redirect(http.StatusTemporaryRedirect, "/")
			return
		}

		s.Redirect(http.StatusTemporaryRedirect, redirectPath.(string))
	}
}
