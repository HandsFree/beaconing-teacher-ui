package req

import (
	"log"
	"strconv"

	"git.juddus.com/HFC/beaconing/json"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

type ActiveLessonPlans struct {
	route.SimpleManagedRoute
}

func (r *ActiveLessonPlans) Handle(s *serv.SessionContext) {
	limitParam := s.DefaultQuery("limit", "5")
	limitParamValue, err := strconv.Atoi(limitParam)
	if err != nil || limitParamValue <= 0 {
		limitParamValue = 5 // NaN
		log.Println("warning ALP limit has illegal value, defaulting to 5")
	}

	lps := []json.LessonPlan{
		NewLessonPlan("Algebra"),
		NewLessonPlan("First steps to Engineering"),
		NewLessonPlan("Advanced Masonary"),
	}

	s.Jsonify(lps[0:limitParamValue])
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
