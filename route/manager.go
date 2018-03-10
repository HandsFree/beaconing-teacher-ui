package route

import (
	"git.juddus.com/HFC/beaconing/paths"
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
	r.routes[route.GET()] = route

	// TODO handle all path types.
	for _, path := range route.GetPaths() {
		switch path.Kind {
		case paths.GET:
			r.SessionContext.RouterEngine.Handle("GET", path.Value, func(ctx *gin.Context) {
				// set the context to pass thru
				r.SessionContext.Context = ctx
				route.Get(r.SessionContext)
			})
		case paths.POST:
			r.SessionContext.RouterEngine.Handle("POST", path.Value, func(ctx *gin.Context) {
				// set the context to pass thru
				r.SessionContext.Context = ctx
				route.Post(r.SessionContext)
			})
		case paths.DELETE:
			r.SessionContext.RouterEngine.Handle("DELETE", path.Value, func(ctx *gin.Context) {
				// set the context to pass thru
				r.SessionContext.Context = ctx
				route.Delete(r.SessionContext)
			})
		}
	}
}
