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

func (r *RouteManager) RegisterRoutes(routes ...Route) {
	for _, route := range routes {
		r.RegisterRoute(route)
	}
}

func (r *RouteManager) RegisterRoute(route Route) {
	route.SetManager(r)
	r.routes[route.GetPath()] = route

	r.SessionContext.RouterEngine.GET(route.GetPath(), func(ctx *gin.Context) {
		// set the context to pass thru
		r.SessionContext.Context = ctx
		route.Handle(r.SessionContext)
	})
}
