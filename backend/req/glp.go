package req

import (
	"log"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"

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

func DeleteGLPRequest(s *gin.Context) {
	idParam := s.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil || id < 0 {
		log.Println("error when sanitising glp id", err.Error())
		s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
		return
	}

	body := api.DeleteGLP(s, id)
	s.Header("Content-Type", "application/json")
	s.JSON(http.StatusOK, gin.H{"status": string(body)})
}

func GetGLPRequest(s *gin.Context) {
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
	var shouldMinify bool = false
	if minify != "" {
		minifyParam, err := strconv.Atoi(minify)
		if err == nil {
			shouldMinify = minifyParam == 1
		} else {
			log.Println("Note: failed to atoi minify param in glp.go", err.Error())
		}
	}

	plan, json := api.GetGamifiedLessonPlan(s, id)
	if plan == nil {
		s.String(http.StatusBadRequest, "Funky error getting the GLP")
		return
	}

	model := &GLPModel{
		Id:           plan.Id,
		Name:         plan.Name,
		Desc:         plan.Desc,
		Author:       plan.Author,
		Category:     plan.Category,
		GamePlotID:   plan.GamePlotId,
		ExternConfig: plan.ExternConfig,
	}
	if !shouldMinify {
		model.Content = json
	}

	s.Header("Content-Type", "application/json")
	s.Jsonify(model)
}
