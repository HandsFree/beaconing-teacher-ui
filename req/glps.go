package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type GLPSRequest struct {
	route.SimpleManagedRoute
}

func NewGLPSRequest(path string) *GLPSRequest {
	req := &GLPSRequest{}
	req.SetPath(path)
	return req
}

func (a *GLPSRequest) Handle(ctx *gin.Context) {

}
