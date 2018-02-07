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

func (r *Page) Post(s *serv.SessionContext)   {}
func (r *Page) Delete(s *serv.SessionContext) {}

func (p *Page) Get(s *serv.SessionContext) {
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
