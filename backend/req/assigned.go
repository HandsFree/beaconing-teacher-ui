package req

import (
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func DeleteAssignedGLPsRequest(s *gin.Context) {
	studentIDParam := s.Param("id")
	studentID, err := strconv.Atoi(studentIDParam)
	if err != nil {
		s.String(http.StatusBadRequest, "No such ID thing!")
		return
	}

	glpIDParam := s.Param("glp")
	glpID, err := strconv.Atoi(glpIDParam)
	if err != nil {
		s.String(http.StatusBadRequest, "No such ID thing!")
		return
	}

	body := api.DeleteAssignedGLP(s, studentID, glpID)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func GetAssignedGLPsRequest(s *gin.Context) {
	studentIDParam := s.Param("id")
	studentID, err := strconv.Atoi(studentIDParam)
	if err != nil {
		s.String(http.StatusBadRequest, "No such ID thing!")
		return
	}

	body := api.GetAssignedGLPS(s, studentID)
	s.Json(body)
}
