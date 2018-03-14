package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetStudentRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentIDParam := s.Param("id")
		studentID, err := strconv.Atoi(studentIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "ID thingy")
			return
		}

		resp, _ := api.GetStudent(s, studentID)
		json, err := jsoniter.Marshal(resp)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}
