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
	if s.paths == nil {
		s.paths = map[string]string{}
	}
	s.paths = paths
}

func (s *SimpleManagedRoute) GetPath() string {
	return s.path
}

// TODO quick hack, fixme!
func (s *SimpleManagedRoute) SetPath(path string) {
	s.SetPaths(map[string]string{"get": path})
}
