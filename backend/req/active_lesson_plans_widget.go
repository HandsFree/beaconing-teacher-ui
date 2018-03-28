package req

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
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

		assignedPlans, err := api.GetRecentlyAssignedGLPS(s)
		if err != nil {
			log.Println("GetActiveLessonPlansWidget: ", err.Error())
			return
		}

		for _, glp := range assignedPlans {
			// log.Println("Displaying ", glp.Name, " as a lesson plan")
			lessonPlan := NewLessonPlanWidget(glp.Name, glp.ID)
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
