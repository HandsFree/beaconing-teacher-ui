package req

import (
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetCheckAuthRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		accessToken := api.GetAccessToken(s)
		if accessToken == "" {
			s.String(http.StatusBadRequest, "Unauthorised access: core")
			return
		}

		json, err := jsoniter.Marshal(&CheckAuthJSON{
			Token: accessToken,
		})
		if err != nil {
			util.Error(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

type CheckAuthJSON struct {
	Token string `json:"token"`
}
