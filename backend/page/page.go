package page

import (
	"git.juddus.com/HFC/beaconing/backend/api"
)

// Page represents a web page in the beaconing
// teacher ui. This wraps around a 'SimpleManagedRoute'
// this will inject template information into the
// index.html webpage with the relevant title, script
// to load and the host.
type Page struct {
	Title    string
	Script   string
	Template string
	Host     string
}

func New(title string, script string) *Page {
	return &Page{
		Title:    title,
		Script:   script,
		Template: "index.html",
		Host:     api.Protocol + api.BaseLink + "/",
	}
}
