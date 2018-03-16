package req

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetProfileRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.GetCurrentUser(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		respJSON, err := jsoniter.Marshal(resp)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(respJSON))
	}
}
