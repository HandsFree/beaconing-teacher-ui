package req

import (
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
)

// Delete's the assigned GLP from the student
// i.e. an un-assign operation
//
// inputs:
// - student id
// - glp id
func DeleteAssignedGLPsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		glpID, err := strconv.ParseUint(s.Param("glp"), 10, 64)
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
		studentID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		// specifies if to include glps assigned to groups
		// the student is a part of
		includeGroups, err := strconv.ParseBool(s.Query("ig"))
		if err != nil {
			util.Error("Query string 'ig' malformed", err)
		}

		body := api.GetAssignedGLPS(s, studentID, includeGroups)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteGroupAssignedRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		glpID, err := strconv.ParseUint(s.Param("glp"), 10, 64)
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
		groupID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.GetGroupAssignedGLPS(s, groupID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
