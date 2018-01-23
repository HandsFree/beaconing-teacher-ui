package page

import (
	"net/http"

	"github.com/gin-contrib/sessions"

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

func NewPage(path string, title string, script string) *Page {
	// rg := regexp.MustCompile("/")
	// matches := rg.FindAllStringIndex(path, -1)

	// very hacky and messy solution for now
	// scriptLink := script
	// relativeDir := "./"

	// if len(matches) == 2 {
	// 	relativeDir = "../"
	// 	scriptLink = relativeDir + script
	// }

	// if len(matches) > 2 {
	// 	relativeDir = strings.Repeat("../", len(matches))
	// 	scriptLink = relativeDir + script
	// }

	page := &Page{
		title:  title,
		script: script,
		host:   "//" + serv.BaseLink + "/",
	}
	page.SetPath(path)
	return page
}

func (p *Page) Handle(s *serv.SessionContext) {
	session := sessions.Default(s.Context)
	code := session.Get("code")
	if code == nil {
		s.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
	}
	s.HTML(http.StatusOK, "index.html", &gin.H{
		"pageTitle":  p.title,
		"pageScript": p.script,
		"host":       p.host,
	})
}
