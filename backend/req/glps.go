package req

import (
	"log"
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/parse"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func slicePlans(plans []*entity.GLP, index int, step int) ([]*entity.GLP, error) {
	planCount := len(plans)

	if index >= planCount {
		return []*entity.GLP{}, nil
	}

	stepIndex := index + step

	if (stepIndex) > planCount {
		return plans[index:], nil
	}

	return plans[index:stepIndex], nil
}

// retrieves multiple glps
//
// inputs:
// - index - the starting glp id (int)
// - step - ... rename me to stride... how many
//   glps to request for (optional, defaults at 15)
//
// - sort - asc or desc, the order in which to sort the glps
//   defaults to ascending
func GetGLPSRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		var index int
		if indexQuery := s.Query("index"); indexQuery != "" {
			var err error
			index, err = strconv.Atoi(indexQuery)
			if err != nil {
				util.Error("GLPSRequest", err.Error())
				index = 0
			}
		}

		var step int
		if stepQuery := s.Query("step"); stepQuery != "" {
			var err error
			step, err = strconv.Atoi(stepQuery)
			if err != nil {
				log.Print("Invalid step", err.Error())
			}
		}

		shouldMinify := false
		if minify := s.Query("minify"); minify != "" {
			minifyParam, err := strconv.Atoi(minify)
			if err == nil {
				shouldMinify = minifyParam == 1
			} else {
				util.Error("Note: failed to atoi minify param in glps.go", err.Error())
			}
		}

		// defaults to Ascending order.
		orders := parse.SortOrder(s.Query("order"))

		plans, err := parse.GLPS(s, shouldMinify)
		if err != nil {
			util.Error("parse.GLPS failed", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		sortQuery := s.Query("sort")
		log.Println("the sort query is '", sortQuery, "'")

		if sortQuery != "" {
			plans, err = parse.SortGLPS(s, plans, sortQuery, orders)
			if err != nil {
				util.Error("Failed to sort GLPs by ", sortQuery, " in order ", orders, "\n"+err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}

		if index != 0 || step != 0 {
			plans, err = slicePlans(plans, index, step)
			if err != nil {
				util.Error("Failed to slice GLPs \n", err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}

		// convert the plans into json and display
		jsonResult, err := jsoniter.Marshal(&plans)
		if err != nil {
			util.Error(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(jsonResult))
	}
}
