package req

import (
	"git.juddus.com/HFC/beaconing/backend/api"
	"github.com/gin-gonic/gin"
)

func GetCheckAuthRequest(s *gin.Context) {
	accessToken := api.GetAccessToken(s)
	s.Jsonify(&CheckAuthJSON{
		Token: accessToken,
	})
}

type CheckAuthJSON struct {
	Token string `json:"token"`
}
