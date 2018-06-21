package req

import (
	"log"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetCheckAuthRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		accessToken := api.GetAccessToken(s)
		if accessToken == "" {
			// header redirect in the GAT function
			// so return here to avoid header re-writes
			return
		}

		json, err := jsoniter.Marshal(&CheckAuthJSON{
			Token: accessToken,
		})
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

type CheckAuthJSON struct {
	Token string `json:"token"`
}
