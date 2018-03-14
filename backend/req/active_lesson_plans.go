package req

import (
	"fmt"
	"log"
	"os"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/route"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-contrib/sessions"
	"github.com/olekukonko/tablewriter"
)

// ActiveLessonPlans handles an active lesson plan request
// to the beaconing core api. It will spit out the json requested.
type ActiveLessonPlans struct {
	route.SimpleManagedRoute
}

func (r *ActiveLessonPlans) Post(s *serv.SessionContext)   {}
func (r *ActiveLessonPlans) Delete(s *serv.SessionContext) {}

func (r *ActiveLessonPlans) Get(s *serv.SessionContext) {
	log.Println("ACTIVE LESSON PLANS GET REQ")

	var lps []types.LessonPlan

	session := sessions.Default(s.Context)
	assignedPlans := session.Get("assigned_plans")

	var assigned = map[uint64]bool{}
	if assignedPlans != nil {
		log.Println("Restored assigned plans: ", len(assigned), "plans active")
		assigned = assignedPlans.(map[uint64]bool)
	} else {
		log.Println("No assigned plans in the session!")
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"GLP"})
	for id := range assigned {
		table.Append([]string{fmt.Sprintf("%d", id)})
	}
	table.Render()

	for glpID := range assigned {
		glp, _ := api.GetGamifiedLessonPlan(s, glpID)
		if glp == nil {
			log.Println("No such lesson plan found for ", glpID)
			// skip this one, TODO
			// should we insert a 404 empty plan here or ?
			continue
		}

		log.Println("Displaying ", glp.Name, " as a lesson plan")
		lessonPlan := NewLessonPlan(glpID, glp)
		lps = append(lps, lessonPlan)
	}
	s.Jsonify(lps)
}

func NewActiveLessonPlans(path string) *ActiveLessonPlans {
	req := &ActiveLessonPlans{}
	req.SetGET(path)
	return req
}

func NewLessonPlan(glpID uint64, glp *types.GamifiedLessonPlan) types.LessonPlan {
	return types.LessonPlan{
		ID:  glpID,
		GLP: glp,
	}
}
