package page

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
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

	// on each page we check the current user
	currUser, _ := api.GetCurrentUser(s)
	var userName string
	userAvatar := []byte{}

	// if the user is logged in we get the
	// avatar hash and we inject their username
	if currUser != nil {
		userAvatar = currUser.GetAvatarHash()
		userName = currUser.Username
	}

	s.HTML(http.StatusOK, "index.html", &gin.H{
		"pageTitle":  p.title,
		"pageScript": p.script,
		"host":       p.host,
		"userAvatar": userAvatar,
		"userName":   userName,
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
