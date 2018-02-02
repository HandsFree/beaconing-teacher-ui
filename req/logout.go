package req

import (
	"net/http"

	"github.com/gin-contrib/sessions"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type LogOutRequest struct {
	route.SimpleManagedRoute
}

func (r *LogOutRequest) Handle(s *serv.SessionContext) {
	session := sessions.Default(s.Context)
	session.Clear()
	session.Save()
	s.Redirect(http.StatusTemporaryRedirect, "/")
}

func NewLogOutRequest(path string) *LogOutRequest {
	req := &LogOutRequest{}
	req.SetPath(path)
	return req
}
