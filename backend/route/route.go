package route

import (
	"git.juddus.com/HFC/beaconing/backend/paths"
	"git.juddus.com/HFC/beaconing/backend/serv"
)

type Route interface {
	Post(ctx *serv.SessionContext)
	Get(ctx *serv.SessionContext)
	Delete(ctx *serv.SessionContext)

	GetManager() *RouteManager
	SetManager(m *RouteManager)

	GetPaths() paths.PathSet

	GET() string

	SetGET(path string)
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
	paths   paths.PathSet
}

func (s *SimpleManagedRoute) SetManager(m *RouteManager) {
	s.manager = m
}

func (s *SimpleManagedRoute) GetManager() *RouteManager {
	return s.manager
}

func (s *SimpleManagedRoute) GetPaths() paths.PathSet {
	return s.paths
}

func (s *SimpleManagedRoute) SetPaths(p paths.PathSet) {
	// lazily allocate the paths
	if s.paths == nil {
		s.paths = paths.Empty()
	}
	s.paths = p
}

func (s *SimpleManagedRoute) GET() string {
	return s.path
}

func (s *SimpleManagedRoute) SetGET(path string) {
	// we only have a GET route.
	s.SetPaths(paths.PathSet{paths.Get(path)})
}
