package page

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
)

type Page struct {
	route.SimpleManagedRoute
	title  string
	script string
	host   string
}

func (p *Page) Handle(s *serv.SessionContext) {
	s.TryAuth(p.GetPath())
	s.HTML(http.StatusOK, "index.html", &gin.H{
		"pageTitle":  p.title,
		"pageScript": p.script,
		"host":       p.host,
	})
}

func NewPage(path string, title string, script string) *Page {
	page := &Page{
		title:  title,
		script: script,
		host:   serv.Protocol + serv.BaseLink + "/",
	}
	page.SetPath(path)
	return page
}
