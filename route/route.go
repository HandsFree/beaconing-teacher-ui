package route

import (
	"git.juddus.com/HFC/beaconing.git/serv"
	"github.com/gin-gonic/gin"
)

type Route interface {
	Handle(ctx *gin.Context)

	GetManager() *RouteManager
	SetManager(m *RouteManager)

	GetPath() string
	SetPath(path string)
}

type SimpleManagedRoute struct {
	Route
	manager *RouteManager
	path    string
}

// fixme: this kind of doesnt make sense
func (s *SimpleManagedRoute) GetServer() *serv.BeaconingServer {
	return s.GetManager().ServInst
}

func (s *SimpleManagedRoute) SetManager(m *RouteManager) {
	s.manager = m
}

func (s *SimpleManagedRoute) GetManager() *RouteManager {
	return s.manager
}

func (s *SimpleManagedRoute) GetPath() string {
	return s.path
}

func (s *SimpleManagedRoute) SetPath(path string) {
	s.path = path
}
