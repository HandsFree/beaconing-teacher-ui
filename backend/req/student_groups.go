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
		// TODO sanitise
		idString := s.Param("id")
		id, err := strconv.ParseInt(idString, 10, 64)
		if err != nil || id < 0 {
			log.Println("StudentGroupRequest", err.Error())
			// TODO handle this properly
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

func GetStudentGroupsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.GetStudentGroups(s)
		if err != nil {
			log.Println("GetStudentGroupsRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func GetStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.GetStudentGroup(s, groupID)
		if err != nil {
			log.Println("GetStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func PutStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.PutStudentGroup(s, groupID)
		if err != nil {
			log.Println("PutStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
