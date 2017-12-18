package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"github.com/gin-gonic/gin"
	"net/http"
)

type StudentRequest struct {
	route.SimpleManagedRoute
}

func NewStudentRequest(path string) *StudentRequest {
	req := &StudentRequest{}
	req.SetPath(path)
	return req
}

func (s *StudentRequest) Handle(ctx *gin.Context) {

}
