package req

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"github.com/olekukonko/tablewriter"
)

func GetActiveLessonPlansWidget() gin.HandlerFunc {
	return func(s *gin.Context) {
		log.Println("ACTIVE LESSON PLANS GET REQ")

		limitParam := s.DefaultQuery("limit", "5")
		limitParamValue, err := strconv.Atoi(limitParam)
		if err != nil || limitParamValue <= 0 {
			limitParamValue = 5 // NaN
			log.Println("warning ALP limit has illegal value, defaulting to 5")
		}

		lps := []types.LessonPlanWidget{}

		session := sessions.Default(s)
		assignedPlans := session.Get("assigned_plans")

		var assigned map[uint64]bool = map[uint64]bool{}
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
			glp, _ := api.GetGLP(s, glpID, true)
			if glp == nil {
				log.Println("No such lesson plan found for ", glpID)
				// skip this one, TODO
				// should we insert a 404 empty plan here or ?
				continue
			}

			log.Println("Displaying ", glp.Name, " as a lesson plan")
			lessonPlan := NewLessonPlanWidget(glp.Name, glpID)
			lps = append(lps, lessonPlan)
		}

		size := int(math.Min(float64(limitParamValue), float64(len(lps))))

		json, err := jsoniter.Marshal(lps[0:size])
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

func NewLessonPlanWidget(name string, glpID uint64) types.LessonPlanWidget {
	return types.LessonPlanWidget{
		Name: name,
		Src:  "https://via.placeholder.com/512x512&text=" + name,
		Link: "/lesson_manager#view?id=" + fmt.Sprintf("%d", glpID) + "&prev=lesson_manager",
	}
}
