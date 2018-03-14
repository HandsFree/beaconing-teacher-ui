package req

import (
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func GetStudentRequest(s *gin.Context) {
	studentIDParam := s.Param("id")
	studentID, err := strconv.Atoi(studentIDParam)
	if err != nil {
		s.String(http.StatusBadRequest, "ID thingy")
		return
	}

	resp, _ := api.GetStudent(s, studentID)
	s.Jsonify(resp)
}
