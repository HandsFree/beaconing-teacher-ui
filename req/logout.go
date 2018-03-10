package req

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"

	"git.juddus.com/HFC/beaconing/cfg"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type LogOutRequest struct {
	route.SimpleManagedRoute
}

func (r *LogOutRequest) Post(s *serv.SessionContext)   {}
func (r *LogOutRequest) Delete(s *serv.SessionContext) {}

func (r *LogOutRequest) Get(s *serv.SessionContext) {
	session := sessions.Default(s.Context)
	session.Clear()

	if err := session.Save(); err != nil {
		log.Println(err.Error())
		return
	}

	logoutLink := fmt.Sprintf("https://core.beaconing.eu/auth/logout?client_id=%s&redirect_uri=%s",
		cfg.Beaconing.Auth.ID,
		serv.LogOutLink)

	fmt.Println(logoutLink)

	s.Redirect(http.StatusTemporaryRedirect, logoutLink)
}

func NewLogOutRequest(path string) *LogOutRequest {
	req := &LogOutRequest{}
	req.SetGET(path)
	return req
}
