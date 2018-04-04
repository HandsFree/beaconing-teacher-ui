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
		switch order {
		case Sci:
			return strings.Compare(name, "science") == 0
		case Tech:
			return strings.Compare(name, "technology") == 0
		case Eng:
			return strings.Compare(name, "engineering") == 0
		case Maths:
			return strings.Compare(name, "maths") == 0
		default:
			return false
		}
	}

	results := []*types.GLP{}

	for _, plan := range plans {
		if isSTEM(plan.Domain) {
			log.Println("Matched plan", plan.Name, " to stem ")
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

func sortByMostAssigned(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	return nil, nil
}

func sortByAvailability(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	return nil, nil
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

// loads glps if
// index and step are both -1 it will
// load all of the GLPS.
func loadPlans(s *gin.Context, index int, step int, shouldMinify bool) ([]*types.GLP, error) {
	if index == -1 && step == -1 {
		resp, err := api.GetGLPS(s, shouldMinify)
		if err != nil {
			log.Println("loadPlans", err.Error())
			return []*types.GLP{}, err
		}

		var plans []*types.GLP
		if err := jsoniter.Unmarshal([]byte(resp), &plans); err != nil {
			log.Println(err.Error())
			return []*types.GLP{}, err
		}
		return plans, nil
	}

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

	var plans []*types.GLP

	for i := uint64(index); len(plans) < int(step) && numFails < attempts; i++ {
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

	return plans, nil
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

		sortQuery := s.Query("sort")
		sortOrderQuery := s.Query("order")

		// PARSE sortOrder
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

		// No index query, set index and step to -1
		if indexQuery == "" {
			index, step = -1, -1
		}

		plans, err := loadPlans(s, index, step, shouldMinify)
		if err != nil {
			log.Println("loadPlans failed", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		if sortQuery != "" {
			var err error
			plans, err = sortPlans(s, plans, sortQuery, sortOrder)
			if err != nil {
				log.Println("Failed to sort GLPs by ", sortQuery, " in order ", sortOrder, "\n"+err.Error())
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
