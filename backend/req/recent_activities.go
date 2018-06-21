package req

import (
	"log"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func getLastActivities(s *gin.Context, n int) ([]activity.Activity, error) {
	currUserID, err := api.GetUserID(s)
	if err != nil {
		log.Println("No such current user!", err.Error())
		return []activity.Activity{}, err
	}
	return api.GetActivities(currUserID, n)
}

func GetRecentActivities() gin.HandlerFunc {
	/*
		first we get the current user using the current_user api

		then we look up all of the activities in the local
		database with the ID of the current_user
	*/
	return func(s *gin.Context) {
		activities, err := getLastActivities(s, 4)
		if err != nil {
			log.Println("GetRecentActivities", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		json, err := jsoniter.Marshal(activities)
		if err != nil {
			log.Println("GetRecentActivities", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}
