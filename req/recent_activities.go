package req

import (
	"git.juddus.com/HFC/beaconing/json"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
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

func (s SimpleActivity) GetMessage() string {
	return s.Message
}

type RecentActivities struct {
	route.SimpleManagedRoute
}

func (r *RecentActivities) Handle(s *serv.SessionContext) {
	activities := []Activity{
		NewLPAssignedActivity("algebra"),
	}
	s.Jsonify(activities)
}

// naming... ?
type LPAssignedActivity struct {
	SimpleActivity
	Plan json.LessonPlan `json:"plan"`
}

func (a *LPAssignedActivity) String() string {
	return a.Message + " " + a.Plan.Name
}

// ────────────────────────────────────────────────────────────────────────────────

func NewRecentActivities(path string) *RecentActivities {
	req := &RecentActivities{}
	req.SetPath(path)
	return req
}

// ────────────────────────────────────────────────────────────────────────────────

func NewLPAssignedActivity(planName string) LPAssignedActivity {
	return LPAssignedActivity{
		SimpleActivity: NewSimpleActivity("Assigned lesson plan"),
		Plan: json.LessonPlan{
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
