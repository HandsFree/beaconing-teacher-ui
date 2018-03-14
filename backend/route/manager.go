package route

import (
	"sync"

	"git.juddus.com/HFC/beaconing/backend/paths"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"github.com/gin-gonic/gin"
)

type RouteManager struct {
	SessionContext *serv.SessionContext
	RouteLocker    sync.RWMutex
}

func NewRouteManager(servInst *serv.SessionContext) *RouteManager {
	return &RouteManager{
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
	r.RouteLocker.Lock()

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

	r.RouteLocker.Unlock()
}
