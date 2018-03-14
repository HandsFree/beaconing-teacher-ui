package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func GetProfileRequest(s *gin.Context) {
	_, resp := api.GetCurrentUser(s)

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, resp)
}
