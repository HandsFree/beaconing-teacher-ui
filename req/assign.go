package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AssignRequest struct {
	route.SimpleManagedRoute
}

func NewAssignRequest(path string) *AssignRequest {
	req := &AssignRequest{}
	req.SetPath(path)
	return req
}

func (a *AssignRequest) Handle(ctx *gin.Context) {

}
