package req

import (
	"log"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
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

func PutProfileRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.PutProfile(s)
		if err != nil {
			log.Println("PutProfileRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
