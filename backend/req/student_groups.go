package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func PostStudentGroupRequest(s *gin.Context) {
	body := api.CreateStudentPOST(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func DeleteStudentGroupRequest(s *gin.Context) {
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

	body := api.DeleteStudentGroup(s, id)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}

func GetStudentGroupRequest(s *gin.Context) {
	body := api.GetStudentGroups(s)
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, body)
}
