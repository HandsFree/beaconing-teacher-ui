package req

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
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
			util.Error("TokenRequest", err.Error())
			s.String(http.StatusBadRequest, "Server Error: 400 Token Refresh Failed")
			return
		}

		user, err := api.GetCurrentUser(s)
		if err != nil {
			util.Error("TokenRequest", err.Error())
			s.String(http.StatusInternalServerError, "Server Error: 500 Failed to get user")
			return
		}

		roleTeacher := false
		for _, v := range user.Roles {
			if v == "teacher" {
				roleTeacher = true
				break
			}
		}

		if !roleTeacher {
			session.Clear()

			if err := session.Save(); err != nil {
				util.Error("GetTokenRequest", err.Error())
			}

			logoutLink := fmt.Sprintf("https://core.beaconing.eu/auth/logout?client_id=%s&redirect_uri=%s",
				cfg.Beaconing.Auth.ID,
				api.GetLogOutLink())

			s.HTML(http.StatusUnauthorized, "unauthorised_user.html", gin.H{
				"errorMessage": "Unauthorised access: not a teacher",
				"logoutLink":   logoutLink,
			})

			return
		}

		if err := session.Save(); err != nil {
			util.Error("TokenRequest", err.Error())
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
