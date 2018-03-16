package req

import (
	"log"
	"net/http"
	"strconv"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetGLPSRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		indexQuery := s.Query("index")

		index, err := strconv.ParseUint(indexQuery, 10, 64)
		if err != nil {
			log.Println("GLPSRequest", err.Error())
			index = 0
		}

		// TODO a step here would be nice too.

		// we have been given a positive index!
		// return back the next 15 glps.
		if indexQuery != "" {

			plans := []*types.GamifiedLessonPlan{}

			// SO BASICALLY because an id might be
			// gone, i.e. say GLPs 52342, 52343, 52344 have been deleted
			// we will keep iterating and trying go get glp's until
			// we have at least 15 plans fetched.
			// we should have a timeout here however
			// because this will likely hang in the event that
			// say we're at GLP 2343 and there are no more plans that exist
			// and we've loaded 14 plans it will keep trying to load more.
			// however i have added an attempt thing here but i think
			// a literal timeout i.e. after 1 second would be preferable.

			log.Println("/intent/glps, LOADING ", index, " PLANS!")

			attempts := 128
			numFails := 0

			for i := index; len(plans) < 15 && numFails < attempts; i++ {
				obj, _ := api.GetGamifiedLessonPlan(s, i)
				if obj == nil {
					log.Println(" - NO GAME PLAN AT INDEX ", i, " SKIPPING!")
					numFails++
					continue
				}

				// we loaded a game plan, but the beaconing api
				// seems to give back an "error" game plan, i.e.
				// with an ID of 0
				// it's easier to check that the id's dont compare
				// rather than seeing if the content has an error message
				if obj.Id != i {
					log.Println(" - NO GAME PLAN AT INDEX ", i, " SKIPPING")
					numFails++
					continue
				}

				log.Println(" - LOADED GAME PLAN ", i)
				plans = append(plans, obj)
			}

			json, err := jsoniter.Marshal(plans)
			if err != nil {
				log.Println(err.Error())
				return
			}

			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, string(json))
			return
		}

		json, err := api.GetGamifiedLessonPlans(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, json)
	}
}
