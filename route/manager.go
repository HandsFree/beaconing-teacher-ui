package route

import (
	"github.com/gin-gonic/gin"
	"git.juddus.com/HFC/beaconing.git/serv"
	"net/http"
)

type RouteManager struct {
	routes map[string]Route
	ServInst *serv.BeaconingServer
}

func NewRouteManager(servInst *serv.BeaconingServer) *RouteManager {
	return &RouteManager {
		routes: map[string]Route{},
		ServInst: servInst,
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
	r.ServInst.RouterEngine.GET(route.GetPath(), func(ctx *gin.Context) {
		route.Handle(ctx)	
	})
}

func (r *RouteManager) HandlePage(c *gin.Context, obj interface{}) {
	_, keyDefined := r.ServInst.TokenStore.Get("code")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
	}
	c.HTML(http.StatusOK, "index.html", obj)
}