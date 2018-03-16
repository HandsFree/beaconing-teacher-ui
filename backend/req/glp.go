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
			minifyParam, err := strconv.Atoi(minify)
			if err == nil {
				shouldMinify = minifyParam == 1
			} else {
				log.Println("Note: failed to atoi minify param in glp.go", err.Error())
			}
		}

		plan, err := api.GetGamifiedLessonPlan(s, id)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		planJSON, err := jsoniter.Marshal(&plan)
		if err != nil {
			log.Println("GetGLPRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		model := &GLPModel{
			Id:           plan.ID,
			Name:         plan.Name,
			Desc:         plan.Desc,
			Author:       plan.Author,
			Category:     plan.Category,
			GamePlotID:   plan.GamePlotID,
			ExternConfig: plan.ExternConfig,
		}

		// only inject the content if we should
		// not minify the model.
		if !shouldMinify {
			model.Content = string(planJSON)
		}

		modelJSON, err := jsoniter.Marshal(model)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(modelJSON))
	}
}
