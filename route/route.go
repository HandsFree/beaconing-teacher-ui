package route

import (
	"git.juddus.com/HFC/beaconing/serv"
)

type Route interface {
	Post(ctx *serv.SessionContext)
	Get(ctx *serv.SessionContext)
	Delete(ctx *serv.SessionContext)

	GetManager() *RouteManager
	SetManager(m *RouteManager)

	GetPaths() map[string]string
	GetPath() string
	SetPath(path string)
}

// SimpleManagedRoute is a a route in the webpage
// which handles all of the basic properties
// though it does not handle the Post/Get/Delete
// requests which are to be implemented by
// the structure that embeds it.
type SimpleManagedRoute struct {
	Route
	manager *RouteManager
	path    string
	paths   map[string]string
}

func (s *SimpleManagedRoute) SetManager(m *RouteManager) {
	s.manager = m
}

func (s *SimpleManagedRoute) GetManager() *RouteManager {
	return s.manager
}

func (s *SimpleManagedRoute) GetPaths() map[string]string {
	return s.paths
}

func (s *SimpleManagedRoute) SetPaths(paths map[string]string) {
	// lazily allocate the paths!
	if s.paths == nil {
		s.paths = map[string]string{}
	}
	s.paths = paths
}

func (s *SimpleManagedRoute) GetPath() string {
	return s.path
}

func (s *SimpleManagedRoute) SetPath(path string) {
	// we only have a get route.
	s.SetPaths(map[string]string{"get": path})
}
