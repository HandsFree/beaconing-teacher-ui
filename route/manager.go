package route

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
)

type RouteManager struct {
	routes   map[string]Route
	ServInst *serv.BeaconingServer
}

func NewRouteManager(servInst *serv.BeaconingServer) *RouteManager {
	return &RouteManager{
		routes:   map[string]Route{},
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
		route.Handle(ctx, r.ServInst)
	})
}

func (r *RouteManager) HandlePage(c *gin.Context, obj interface{}) {
	_, keyDefined := r.ServInst.TokenStore.Get("code")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, serv.AuthLink)
	}
	c.HTML(http.StatusOK, "index.html", obj)
}
