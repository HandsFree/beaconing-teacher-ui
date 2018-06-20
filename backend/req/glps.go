package req

import (
	"log"
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/parse"
	"github.com/HandsFree/beaconing-teacher-ui/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func slicePlans(plans []*types.GLP, index int, step int) ([]*types.GLP, error) {
	plansLength := len(plans)

	if index >= plansLength {
		return []*types.GLP{}, nil
	}

	stepIndex := index + step

	// fmt.Println(plansLength, stepIndex)

	if (stepIndex) > plansLength {
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
		indexQuery := s.Query("index")
		stepQuery := s.Query("step")

		// PARSE step
		step, err := strconv.Atoi(stepQuery)
		if err != nil {
			log.Print("Invalid step", err.Error())
		}

		// PARSE minify
		minify := s.Query("minify")
		shouldMinify := false
		if minify != "" {
			minifyParam, err := strconv.Atoi(minify)
			if err == nil {
				shouldMinify = minifyParam == 1
			} else {
				log.Println("Note: failed to atoi minify param in glps.go", err.Error())
			}
		}

		// PARSE index
		index, err := strconv.Atoi(indexQuery)
		if err != nil {
			log.Println("GLPSRequest", err.Error())
			index = 0
		}

		// defaults to Ascending order.
		order := parse.SortOrder(s.Query("order"))
		if order == parse.Undefined {
			order = parse.Ascending
		}

		plans, err := parse.GLPS(s, shouldMinify)
		if err != nil {
			log.Println("parse.GLPS failed", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		if sortQuery := s.Query("sort"); sortQuery != "" {
			plans, err = parse.SortGLPS(s, plans, sortQuery, order)
			if err != nil {
				log.Println("Failed to sort GLPs by ", sortQuery, " in order ", order, "\n"+err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}

		if indexQuery != "" && stepQuery != "" {
			plans, err = slicePlans(plans, index, step)
			if err != nil {
				log.Println("Failed to slice GLPs \n", err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}

		// convert the plans into json and display
		jsonResult, err := jsoniter.Marshal(&plans)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(jsonResult))
	}
}
