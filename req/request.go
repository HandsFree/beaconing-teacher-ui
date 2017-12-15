package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Request struct {
	route.SimpleManagedRoute
}

func NewRequest(path string) *Request {
	req := &Request{}
	req.SetPath(path)
	return req
}

func (r *Request) Handle(ctx *gin.Context) {
	if code := ctx.Query("code"); code != "" {
		r.GetManager().ServInst.TokenStore.Set("code", code)
		r.GetManager().ServInst.GetToken()
		ctx.Redirect(http.StatusTemporaryRedirect, "/")
	}
}