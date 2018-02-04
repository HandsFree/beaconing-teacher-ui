package req

import (
	"log"
	"math"
	"strconv"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"git.juddus.com/HFC/beaconing/types"
	"github.com/gin-contrib/sessions"
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

	lps := []types.LessonPlan{}

	session := sessions.Default(s.Context)
	assignedPlans := session.Get("assigned_plans")

	var assigned map[int]bool = map[int]bool{}
	if assignedPlans != nil {
		log.Println("Restored assigned plans: ", len(assigned), "plans active")
		assigned = assignedPlans.(map[int]bool)
	} else {
		log.Println("No assigned plans in the session!")
	}

	for glpID, _ := range assigned {
		_, glp := api.GetGamifiedLessonPlan(s, glpID)
		if glp == nil {
			log.Println("No such lesson plan found for ", glpID, " error:\n", err.Error())
			// skip this one, TODO
			// should we insert a 404 empty plan here or ?
			continue
		}

		log.Println("Displaying ", glp.Name, " as a lesson plan")
		lessonPlan := NewLessonPlan(glp.Name)
		lps = append(lps, lessonPlan)
	}

	size := int(math.Min(float64(limitParamValue), float64(len(lps))))
	s.Jsonify(lps[0:size])
}

func NewActiveLessonPlans(path string) *ActiveLessonPlans {
	req := &ActiveLessonPlans{}
	req.SetPath(path)
	return req
}

func NewLessonPlan(name string) types.LessonPlan {
	return types.LessonPlan{
		Name: name,
		Src:  "https://via.placeholder.com/512x512&text=" + name,
		Link: "#",
	}
}
