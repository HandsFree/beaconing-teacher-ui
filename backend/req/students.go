package req

import (
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/gin-gonic/gin"
)

func GetStudentsNotAssignedToRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
	}
}

func GetStudentsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.GetStudents(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, resp)
	}
}
