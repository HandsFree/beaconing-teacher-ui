package api

import (
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
)

func GetGameplots(s *gin.Context) (string, error) {
	apiPath := API.getPath(s, "gameplots/")

	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetGamePlots", err.Error())
		return "", err
	}
	if status != http.StatusOK {
		util.Info("[GetGamePlots] Status Returned: ", status)
		return "", nil
	}

	return string(resp), nil
}
