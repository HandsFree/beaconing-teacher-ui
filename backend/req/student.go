package req

import (
	"log"
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// retrieves the given student of the given student id
//
// input:
// - student id
func GetStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentIDParam := s.Param("id")
		studentID, err := strconv.Atoi(studentIDParam)
		if err != nil {
			log.Println("GetStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		resp, err := api.GetStudent(s, studentID)
		if err != nil {
			log.Println("GetStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		json, err := jsoniter.Marshal(resp)
		if err != nil {
			log.Println("GetStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

func PutStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentIDParam := s.Param("id")
		studentID, err := strconv.Atoi(studentIDParam)
		if err != nil {
			log.Println("PutStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		resp, err := api.PutStudent(s, studentID)
		if err != nil {
			log.Println("PutStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(resp))
	}
}

func DeleteStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentIDParam := s.Param("id")
		studentID, err := strconv.Atoi(studentIDParam)
		if err != nil {
			log.Println("DeleteStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		resp, err := api.DeleteStudent(s, studentID)
		if err != nil {
			log.Println("DeleteStudentRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(resp))
	}
}

func PostStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.PostStudent(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(resp))
	}
}
