package req

import (
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func DeleteAssignedGLPsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
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
}

func GetAssignedGLPsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentIDParam := s.Param("id")
		studentID, err := strconv.Atoi(studentIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.GetAssignedGLPS(s, studentID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteGroupAssignedRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
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

		body := api.DeleteGroupAssignedGLP(s, groupID, glpID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func GetStudentGroupAssignedRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.GetGroupAssignedGLPS(s, groupID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
