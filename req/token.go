package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type TokenRequest struct {
	route.SimpleManagedRoute
}

func NewTokenRequest(path string) *TokenRequest {
	req := &TokenRequest{}
	req.SetPath(path)
	return req
}

func (r *TokenRequest) Handle(ctx *gin.Context) {
	if code := ctx.Query("code"); code != "" {
		r.GetManager().ServInst.TokenStore.Set("code", code)
		r.GetManager().ServInst.GetToken()
		ctx.Redirect(http.StatusTemporaryRedirect, "/")
	}
}
