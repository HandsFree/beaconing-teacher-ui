package req

import (
	"git.juddus.com/HFC/beaconing/json"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type ActiveLessonPlans struct {
	route.SimpleManagedRoute
}

func (r *ActiveLessonPlans) Handle(s *serv.SessionContext) {
	// todo query option for top
	// ?top=5
	// e.g. returning only the top 5 plans?
	// otherwise this widget will return all N active lesson plans
	// sorted in alphabetic order.

	lps := []json.LessonPlan{
		NewLessonPlan("Algebra"),
		NewLessonPlan("First steps to Engineering"),
		NewLessonPlan("Advanced Masonary"),
		NewLessonPlan("Underwater Basket Weaving"),
	}
	s.Jsonify(lps)
}

func NewActiveLessonPlans(path string) *ActiveLessonPlans {
	req := &ActiveLessonPlans{}
	req.SetPath(path)
	return req
}

func NewLessonPlan(name string) json.LessonPlan {
	return json.LessonPlan{
		Name: name,
		Src:  "https://via.placeholder.com/512x512&text=" + name,
		Link: "#",
	}
}
