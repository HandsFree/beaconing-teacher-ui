package route

import (
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
)

type RouteManager struct {
	routes         map[string]Route
	SessionContext *serv.SessionContext
}

func NewRouteManager(servInst *serv.SessionContext) *RouteManager {
	return &RouteManager{
		routes:         map[string]Route{},
		SessionContext: servInst,
	}
}

func (r *RouteManager) RegisterRoutes(routerType string, routes ...Route) {
	for _, route := range routes {
		r.RegisterRoute(routerType, route)
	}
}

func (r *RouteManager) RegisterRoute(routerType string, route Route) {
	route.SetManager(r)
	r.routes[route.GetPath()] = route

	r.SessionContext.RouterEngine.Handle(routerType, route.GetPath(), func(ctx *gin.Context) {
		// set the context to pass thru
		r.SessionContext.Context = ctx
		route.Handle(r.SessionContext)
	})
}
