package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"net/http"
	log "log"
	jsoniter "github.com/json-iterator/go"
)

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
func NewSimpleActivity(message string) SimpleActivity {
	return SimpleActivity{
		Message: message,
	}
}
func (s SimpleActivity) GetMessage() string {
	return s.Message
}

// naming... ?
type LPAssignedActivity struct {
	SimpleActivity
	Plan LessonPlan `json:"plan"`
}

func (a *LPAssignedActivity) String() string {
	return a.Message + " " + a.Plan.Name
}

func NewLPAssignedActivity(planName string) LPAssignedActivity {
	return LPAssignedActivity {
		SimpleActivity: NewSimpleActivity("Assigned lesson plan"),
		Plan: LessonPlan {
			Name: planName,

			// would this be in the database or
			// perhaps we'll have to cache this ourselves
			// or something im not sure.
			Link: "http://google.com",
		},
	}
}

type RecentActivities struct {
	route.SimpleManagedRoute
}

func NewRecentActivities(path string) *RecentActivities {
	req := &RecentActivities{}
	req.SetPath(path)
	return req
}

func (r *RecentActivities) Handle(s *serv.SessionContext) {
	activities := []Activity{
		NewLPAssignedActivity("algebra"),
	}

	json, err := jsoniter.Marshal(activities)
    if err != nil {
    	// TODO proper error handling
    	log.Fatal(err)
        return
    }

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(json))
}