package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
)

type TokenRequest struct {
	route.SimpleManagedRoute
}

func NewTokenRequest(path string) *TokenRequest {
	req := &TokenRequest{}
	req.SetPath(path)
	return req
}

func (r *TokenRequest) Handle(ctx *gin.Context, s *serv.BeaconingServer) {
	code := ctx.Query("code")
	if code == "" {
		return
	}

	s.TokenStore.Set("code", code)
	s.GetToken()
	ctx.Redirect(http.StatusTemporaryRedirect, "/")
}
