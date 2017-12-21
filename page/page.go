package page

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Page struct {
	route.SimpleManagedRoute
	title  string
	script string
}

func NewPage(path string, title string, script string) *Page {
	page := &Page{
		title:  title,
		script: script,
	}
	page.SetPath(path)
	return page
}

func (p *Page) Handle(s *serv.SessionContext) {
	_, keyDefined := s.TokenStore.Get("code")
	if !keyDefined {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
	}
	s.HTML(http.StatusOK, "index.html", &gin.H{
		"pageTitle":  p.title,
		"pageScript": p.script,
	})
}
