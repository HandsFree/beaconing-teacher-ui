package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func GetStudentsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.GetStudents(s)
		if err != nil {
			s.String(http.StatusBadRequest, "oh boy! "+err.Error())
			return
		}
		s.JSON(http.StatusOK, resp)
	}
}
