package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

func NewGLPRequest(path string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPath(path)
	return req
}

func (a *GLPRequest) Handle(ctx *gin.Context) {

}
