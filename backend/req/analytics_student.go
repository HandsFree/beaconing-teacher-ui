package req

import (
	"log"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"

	"net/http"
	"strconv"
)

func GetAnalyticsStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		resp, err := api.GetStudentAnalytics(s, id)
		if err == nil {
			log.Println(string(resp))
		}

		var model interface{}
		planJSON, err := jsoniter.Marshal(model)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(planJSON))
	}
}
