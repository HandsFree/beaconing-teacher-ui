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

// bolted on stem subjects for now, feel free to reorganise this
const (
	Ascending SortingOrder = iota
	Descending
	Sci
	Tech
	Eng
	Maths
)

func sortByName(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	sort.SliceStable(plans, func(i, j int) bool {
		if order == Descending {
			return plans[i].Name > plans[j].Name
		}

		return plans[i].Name < plans[j].Name
	})

	return plans, nil
}

func sortBySTEM(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	isSTEM := func(name string) bool {
		name = strings.ToLower(name)
		switch name {
		case "science":
			if order == Sci {
				return true
			}
		case "technology":
			if order == Tech {
				return true
			}
		case "engineering":
			if order == Eng {
				return true
			}
		case "maths":
			if order == Maths {
				return true
			}
		}
		return false
	}

	results := []*types.GLP{}

	for _, plan := range plans {
		log.Println("Sorting by stem! Domain is '" + plan.Domain + "'")
		if isSTEM(plan.Domain) {
			results = append(results, plan)
		}
	}

	return results, nil
}

func sortByCreationTime(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[j].CreatedAt.Before(plans[i].CreatedAt)
		}
		return plans[i].CreatedAt.Before(plans[j].CreatedAt)
	})
	return plans, nil
}

func sortByRecentlyUpdated(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[j].UpdatedAt.Before(plans[i].UpdatedAt)
		}
		return plans[i].UpdatedAt.Before(plans[j].UpdatedAt)
	})
	return plans, nil
}

func sortByRecentlyAssigned(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	// TODO we do a load for the GLPS and basically
	// throw them out to reload the ones that have been
	// recently assigned
	// i.e. this could be faster
	glps, err := api.GetRecentlyAssignedGLPS(s)
	if err != nil {
		log.Println("failed to get recently assigned glps")
		return plans, err
	}
	return glps, nil
}

// invoke sort plan with query
// ?sort=name, ?sort=stem, ?sort=created, etc.
func sortPlans(s *gin.Context, plans []*types.GLP, sortType string, order SortingOrder) ([]*types.GLP, error) {
	// TODO
	// sort by most assigned "popular"
	// sort by deadline soonest/further "deadline"
	// sort by recently modified "modified"
	// sort by draft? whats this.

	switch strings.ToLower(sortType) {
	case "name":
		return sortByName(s, plans[:], order)
	case "stem":
		return sortBySTEM(s, plans[:], order)
	case "created":
		return sortByCreationTime(s, plans[:], order)
	case "updated":
		return sortByRecentlyUpdated(s, plans[:], order)
	case "assigned":
		return sortByRecentlyAssigned(s, plans[:], order)
	default:
		return nil, errors.New("No such sort type '" + sortType + "'")
	}
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
		stepQuery := s.DefaultQuery("step", "15")
		step, err := strconv.ParseUint(stepQuery, 10, 32)
		if err != nil {
			log.Print("Invalid step", err.Error())
			step = 15
		}

		minify := s.Query("minify")

		// dont minify by default, however if
		// we have a minify parameter with the value
		// 1 then we will minify this glp request.
		// NOTE: that if the parameter fails to parse, etc.
		// then it is completely ignored in the request.
		shouldMinify := false
		if minify != "" {
			minifyParam, err := strconv.Atoi(minify)
			if err == nil {
				shouldMinify = minifyParam == 1
			} else {
				log.Println("Note: failed to atoi minify param in glps.go", err.Error())
			}
		}

		index, err := strconv.ParseUint(indexQuery, 10, 64)
		if err != nil {
			log.Println("GLPSRequest", err.Error())
			index = 0
		}

		sortQuery := s.Query("sort")
		sortOrderQuery := s.Query("order")

		var sortOrder SortingOrder

		switch strings.ToLower(sortOrderQuery) {
		case "desc":
			sortOrder = Descending
		case "asc":
			sortOrder = Ascending
		case "science":
			sortOrder = Sci
		case "technology":
			sortOrder = Tech
		case "engineering":
			sortOrder = Eng
		case "maths":
			sortOrder = Maths
		default:
			sortOrder = Ascending
		}

		plans := []*types.GLP{}

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
				obj, _ := api.GetGLP(s, i, shouldMinify)
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
			result, err := api.GetGLPS(s, shouldMinify)
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
			resultPlans, err := sortPlans(s, plans, sortQuery, sortOrder)
			if err != nil {
				log.Println("Failed to sort GLPs by ", sortQuery, " in order ", sortOrder, "\n"+err.Error())
				// the question is, do we throw an
				// error or do we allow the unsorted
				// glps to pass through anyway.
			} else {
				plans = resultPlans
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
