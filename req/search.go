package req

import (
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"
)

type SearchRequestQuery struct {
	Query string
}

type SearchRequest struct {
	route.SimpleManagedRoute
}

func processSearch(json SearchRequestQuery) {

}

func (a *SearchRequest) Handle(s *serv.SessionContext) {
	var json SearchRequestQuery
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println(err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	processSearch(json)
}

func NewSearchRequest(path string) *SearchRequest {
	req := &SearchRequest{}
	req.SetPath(path)
	return req
}
