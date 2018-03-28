package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func PostStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.CreateStudentGroup(s)
		if err != nil {
			log.Println("PostStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idString := s.Param("id")
		id, err := strconv.ParseInt(idString, 10, 64)
		if err != nil || id < 0 {
			log.Println("StudentGroupRequest", err.Error())
			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, "Oh dear there was some error thing!")
			return
		}

		body, err := api.DeleteStudentGroup(s, id)
		if err != nil {
			log.Println("DeleteStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func GetStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.GetStudentGroups(s)
		if err != nil {
			log.Println("GetStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
