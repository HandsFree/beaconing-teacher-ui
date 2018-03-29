package req

import (
	"log"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"

	"net/http"
	"strconv"
)

type GLPModel struct {
	Id           uint64 `json:"id"`
	Name         string `json:"name"`
	Desc         string `json:"description"`
	Author       string `json:"author"`
	Category     string `json:"category"`
	Content      string `json:"content"`
	GamePlotID   uint64 `json:"gamePlotId"`
	ExternConfig string `json:"externConfig"`
}

func PostGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.CreateGLP(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(resp))
	}
}

// deletes the given glp
//
// inputs:
// - glp id
func DeleteGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			log.Println("error when sanitising glp id", err.Error())
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		body, err := api.DeleteGLP(s, id)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.JSON(http.StatusOK, gin.H{"status": string(body)})
	}
}

// retrieves the given glp
//
// inputs:
// - glp id
// - minify (bool, optional)
//   whether the "contents" of the GLP is omitted or not
func GetGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		minify := s.Query("minify")

		// dont minify by default, however if
		// we have a minify parameter with the value
		// 1 then we will minify this glp request.
		// NOTE: that if the parameter fails to parse, etc.
		// then it is completely ignored in the request.
		shouldMinify := false
		if minify != "" {
			minifyParam, errConv := strconv.Atoi(minify)
			if errConv == nil {
				shouldMinify = minifyParam == 1
			} else {
				log.Println("Note: failed to atoi minify param in glp.go", err.Error())
			}
		}

		plan, err := api.GetGLP(s, id, shouldMinify)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// log.Println("GLP Testing!")
		// log.Println("-", plan.Analytics)
		// log.Println("-", plan.Analytics.ActivityID)
		// log.Println("-", plan.Analytics.Json.Analytics.TrackingCode)
		// log.Println("-", plan.Analytics.Json.Analytics.Dashboard)

		planJSON, err := jsoniter.Marshal(plan)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(planJSON))
	}
}
