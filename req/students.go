package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type StudentsRequest struct {
	route.SimpleManagedRoute
}

func NewStudentsRequest(path string) *StudentsRequest {
	req := &StudentsRequest{}
	req.SetPath(path)
	return req
}

func (s *StudentsRequest) Handle(ctx *gin.Context) {

}
