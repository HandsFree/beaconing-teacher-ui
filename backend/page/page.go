package page

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/route"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"github.com/gin-gonic/gin"
)

// Page represents a web page in the beaconing
// teacher ui. This wraps around a 'SimpleManagedRoute'
// this will inject template information into the
// index.html webpage with the relevant title, script
// to load and the host.
type Page struct {
	route.SimpleManagedRoute
	title  string
	script string
	host   string
}

func (r *Page) Post(s *serv.SessionContext) {}

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
	page.SetGET(path)
	return page
}
