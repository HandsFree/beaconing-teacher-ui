package req

import (
	"log"
	"net/http"
	_ "time"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
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

// TODO: move ALL of these structures from the widgets into
// some central thing otherwise I can imagine we will have
// a point of converting from LessonPlan type to LessonPlanJSON
// blah blah blah

// this is very much a hacked together structure
// for now. i feel like this would benefit with some
// kind of event listening system thingy
// but i guess we're going to have to scrape these
// actions from an API somewhere?
type Activity interface {
	// for example:
	// Assigned new lesson plan
	GetMessage() string
}

// raises the question of ... how do we
// handle time in this case?
// https://stackoverflow.com/questions/23695479/format-timestamp-in-outgoing-json-in-golang
// TODO: ask elliot. i guess time.Time should be good but, depends how
// it's stored on the API
type SimpleActivity struct {
	Message string `json:"message"`
	// TODO: time!
}

func (s SimpleActivity) GetMessage() string {
	return s.Message
}

// WEB PAGE

func getLastActivities(s *gin.Context, n int) []types.Activity {
	activities := api.GetActivities(api.GetUserID(s), n)
	return activities
}

func GetRecentActivities() gin.HandlerFunc {
	return func(s *gin.Context) {
		/*
			first we get the current user using the current_user api

			then we look up all of the activities in the local
			database with the ID of the current_user
		*/
		activities := getLastActivities(s, 15)
		json, err := jsoniter.Marshal(activities)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

// ACTIVITIES

type LPAssignedActivity struct {
	SimpleActivity
	Plan types.LessonPlanWidget `json:"plan"`
}

func (a *LPAssignedActivity) String() string {
	return a.Message + " " + a.Plan.Name
}

func NewLPAssignedActivity(planName string) LPAssignedActivity {
	return LPAssignedActivity{
		SimpleActivity: NewSimpleActivity("Assigned lesson plan"),
		Plan: types.LessonPlanWidget{
			Name: planName,

			// would this be in the database or
			// perhaps we'll have to cache this ourselves
			// or something im not sure.
			Link: "http://google.com",
		},
	}
}

func NewSimpleActivity(message string) SimpleActivity {
	return SimpleActivity{
		Message: message,
	}
}
