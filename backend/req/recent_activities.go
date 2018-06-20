package req

import (
	"log"
	"net/http"
	_ "time"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activities"
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

/*

CREATE TABLE activities (
    id serial PRIMARY KEY,
	teacher_id integer NOT NULL,
    creation_date date NOT NULL,
    activity_type integer NOT NULL,
	api_req jsonb NOT NULL
);

*/

func getLastActivities(s *gin.Context, n int) ([]activities.Activity, error) {
	currUserId, err := api.GetUserID(s)
	if err != nil {
		log.Println("No such current user!", err.Error())
		return []activities.Activity{}, err
	}
	return api.GetActivities(currUserId, n)
}

func GetRecentActivities() gin.HandlerFunc {
	return func(s *gin.Context) {
		/*
			first we get the current user using the current_user api

			then we look up all of the activities in the local
			database with the ID of the current_user
		*/
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
