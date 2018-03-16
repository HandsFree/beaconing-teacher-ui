package req

import (
	"errors"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type SortingOrder uint

const (
	Ascending SortingOrder = iota
	Descending
)

func sortByName(plans []*types.GamifiedLessonPlan, order SortingOrder) ([]*types.GamifiedLessonPlan, error) {
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[i].Name[0] > plans[j].Name[0]
		}

		return plans[i].Name[0] < plans[j].Name[0]
	})
	return plans, nil
}

func sortBySTEM(plans []*types.GamifiedLessonPlan, order SortingOrder) ([]*types.GamifiedLessonPlan, error) {
	isSTEM := func(name string) bool {
		name = strings.ToLower(name)
		switch name {
		case "science":
		case "technology":
		case "engineering":
		case "maths":
			return true
		}
		return false
	}

	results := []*types.GamifiedLessonPlan{}

	for _, plan := range plans {
		if len(plan.Content) == 0 {
			log.Println("Skipping GLP", plan.ID)
			continue
		}

		log.Println("Decoding ", plan.Content)

		type glpContent struct {
			Domain string `json:"domain"`
		}

		var data glpContent
		err := jsoniter.Unmarshal([]byte(plan.Content), &data)
		if err != nil {
			log.Println("Failed to decode domain, ", err.Error())
			continue
		}

		domain := data.Domain
		log.Println("Sorting by stem! Domain is '" + domain + "'")
		if isSTEM(domain) {
			results = append(results, plan)
		}

		return nil, errors.New("unimplemented, we can't parse the contents of a GLP just yet")
	}

	return results, nil
}

func sortByCreationTime(plans []*types.GamifiedLessonPlan, order SortingOrder) ([]*types.GamifiedLessonPlan, error) {
	// based of the assumption (see issue #45) that they
	// are from the core API in order of creation if we
	// are in ascending order, do nothing that is the most
	// recently created.
	// descending order we simply reverse the array.
	if order == Ascending {
		return plans, nil
	}

	s := plans[:]
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
	return plans, nil
}

// invoke sort plan with query
// ?sort=name, ?sort=stem, ?sort=created, etc.
func sortPlans(plans []*types.GamifiedLessonPlan, sortType string, order SortingOrder) ([]*types.GamifiedLessonPlan, error) {
	// TODO
	// sort by most assigned "popular"
	// sort by deadline soonest/further "deadline"
	// sort by recently modified "modified"
	// sort by draft? whats this.

	switch strings.ToLower(sortType) {
	case "name":
		return sortByName(plans[:], order)
	case "stem":
		return sortBySTEM(plans[:], order)
	case "created":
		return sortByCreationTime(plans[:], order)
	default:
		return nil, errors.New("No such sort type '" + sortType + "'")
	}
}

func GetGLPSRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		indexQuery := s.Query("index")
		stepQuery := s.DefaultQuery("step", "15")
		step, err := strconv.ParseUint(stepQuery, 10, 32)
		if err != nil {
			log.Print("Invalid step", err.Error())
			step = 15
		}

		index, err := strconv.ParseUint(indexQuery, 10, 64)
		if err != nil {
			log.Println("GLPSRequest", err.Error())
			index = 0
		}

		sortQuery := s.Query("sort")

		sortOrder := Ascending
		{
			// "asc" or "desc"
			sortOrderQuery := s.Query("order")
			if strings.ToLower(sortOrderQuery) == "desc" {
				sortOrder = Descending
			} else if strings.ToLower(sortOrderQuery) == "asc" {
				sortOrder = Ascending
			}
		}

		plans := []*types.GamifiedLessonPlan{}

		// we have been given a positive index!
		// return back the next {step} glps.
		if indexQuery != "" {
			// SO BASICALLY because an id might be
			// gone, i.e. say GLPs 52342, 52343, 52344 have been deleted
			// we will keep iterating and trying go get glp's until
			// we have at least {step} plans fetched.
			// we should have a timeout here however
			// because this will likely hang in the event that
			// say we're at GLP 2343 and there are no more plans that exist
			// and we've loaded 14 plans it will keep trying to load more.
			// however i have added an attempt thing here but i think
			// a literal timeout i.e. after 1 second would be preferable.

			log.Println("/intent/glps, LOADING ", index, " PLANS!")

			attempts := 128
			numFails := 0

			for i := index; len(plans) < int(step) && numFails < attempts; i++ {
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
				if obj.ID != i {
					log.Println(" - NO GAME PLAN AT INDEX ", i, " SKIPPING")
					numFails++
					continue
				}

				log.Println(" - LOADED GAME PLAN ", i)
				plans = append(plans, obj)
			}
		} else {
			result, err := api.GetGamifiedLessonPlans(s)
			if err != nil {
				log.Println("GetGLPSRequst", err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}

			// no sort query lets just return the
			// string now.
			if sortQuery == "" {
				s.Header("Content-Type", "application/json")
				s.String(http.StatusOK, result)
				return
			}

			// convert the json string into an array of objects.
			if err := jsoniter.Unmarshal([]byte(result), &plans); err != nil {
				log.Println(err.Error())
				s.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}

		// in theory we should have a sort here.
		if sortQuery != "" {
			resultPlans, err := sortPlans(plans, sortQuery, sortOrder)
			if err != nil {
				log.Println("Failed to sort GLPs by ", sortQuery, " in order ", sortOrder)
				// the question is, do we throw an
				// error or do we allow the unsorted
				// glps to pass through anyway.
			}

			plans = resultPlans
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
