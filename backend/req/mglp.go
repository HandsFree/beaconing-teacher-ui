package req

import (
	"log"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"

	"net/http"
	"strconv"
)

type minifiedGLPModel struct {
	Id           uint64
	Name         string
	Desc         string
	Author       string
	Category     string
	TrackingCode string
	ActivityID   string
	Dashboard    string
}

func GetMinifiedGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		plan, err := api.GetGLP(s, id, false)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		model := minifiedGLPModel{
			Id:           plan.ID,
			Name:         plan.Name,
			Desc:         plan.Desc,
			Author:       plan.Author,
			Category:     plan.Category,
			TrackingCode: plan.Analytics.Json.Analytics.TrackingCode,
			ActivityID:   plan.Analytics.Json.Analytics.ActivityID,
			Dashboard:    plan.Analytics.Json.Analytics.Dashboard,
		}

		planJSON, err := jsoniter.Marshal(model)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(planJSON))
	}
}
