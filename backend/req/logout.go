package req

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
)

func GetLogOutRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		session := sessions.Default(s)
		session.Clear()

		if err := session.Save(); err != nil {
			log.Println("LogOutRequest", err.Error())
			return
		}

		logoutLink := fmt.Sprintf("https://core.beaconing.eu/auth/logout?client_id=%s&redirect_uri=%s",
			cfg.Beaconing.Auth.ID,
			api.GetLogOutLink())

		fmt.Println(logoutLink)

		s.Redirect(http.StatusTemporaryRedirect, logoutLink)
	}
}
