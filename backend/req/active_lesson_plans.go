package req

import (
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// ActiveLessonPlans handles an active lesson plan request
// to the beaconing core api. It will spit out the json requested.
func GetActiveLessonPlans() gin.HandlerFunc {
	return func(s *gin.Context) {
		var lps []entity.LessonPlan

		session := sessions.Default(s)
		assignedPlans := session.Get("assigned_plans")

		var assigned = map[uint64]bool{}
		if assignedPlans != nil {
			util.Verbose("Restored assigned plans: ", len(assigned), "plans active")
			assigned = assignedPlans.(map[uint64]bool)
		} else {
			util.Verbose("No assigned plans in the session!")
		}

		for glpID := range assigned {
			glp, _ := api.GetGLP(s, glpID, true)
			if glp == nil {
				util.Warn("No such lesson plan found for ", glpID)
				// skip this one, TODO
				// should we insert a 404 empty plan here or ?
				continue
			}

			util.Error("Displaying ", glp.Name, " as a lesson plan")
			lessonPlan := NewLessonPlan(glpID, glp)
			lps = append(lps, lessonPlan)
		}

		json, err := jsoniter.Marshal(lps)
		if err != nil {
			util.Error(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

func NewLessonPlan(glpID uint64, glp *entity.GLP) entity.LessonPlan {
	return entity.LessonPlan{
		ID:  glpID,
		GLP: glp,
	}
}
