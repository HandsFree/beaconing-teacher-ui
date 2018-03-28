package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
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
