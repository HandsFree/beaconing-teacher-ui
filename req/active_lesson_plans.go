package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"net/http"
	log "log"
	jsoniter "github.com/json-iterator/go"
)

func NewLessonPlan(name string) LessonPlan {
	return LessonPlan {
		Name: name,
		Image: "https://via.placeholder.com/512x512&text=" + name,
		Link: "https://google.com/q?=what+is+" + name,
	}
}

type ActiveLessonPlans struct {
	route.SimpleManagedRoute
}

func NewActiveLessonPlans(path string) *ActiveLessonPlans {
	req := &ActiveLessonPlans{}
	req.SetPath(path)
	return req
}

func (r *ActiveLessonPlans) Handle(s *serv.SessionContext) {
	// todo query option for top
	// ?top=5 
	// e.g. returning only the top 5 plans?
	// otherwise this widget will return all N active lesson plans
	// sorted in alphabetic order.

	lps := []LessonPlan{
		NewLessonPlan("Algebra"),
		NewLessonPlan("First steps to Engineering"),
		NewLessonPlan("Advanced Masonary"),
		NewLessonPlan("Underwater Basket Weaving"),
	}

	json, err := jsoniter.Marshal(lps)
    if err != nil {
    	// TODO proper error handling
    	log.Fatal(err)
        return
    }

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(json))
}