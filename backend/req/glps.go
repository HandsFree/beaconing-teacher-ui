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
	Public
	Private
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
	glps, err := api.GetMostAssigned(s)
	if err != nil {
		log.Println("failed to get most assigned glps")
		return plans, err
	}
	return glps, nil
}

func boolToInt(b bool) int8 {
	if b {
		return 1
	}
	return 0
}

func sortByAvailability(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	results := []*types.GLP{}

	switch order {
	case Public:
		for _, plan := range plans {
			if plan.Public {
				results = append(results, plan)
			}
		}
	case Private:
		for _, plan := range plans {
			if !plan.Public {
				results = append(results, plan)
			}
		}
	default:
		return results, nil
	}

	return results, nil
}

func sortByOwnedByMe(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	sort.Slice(plans, func(i, j int) bool {
		// easiest way to sort booleans
		iOwned, jOwned := boolToInt(plans[i].OwnedByMe), boolToInt(plans[j].OwnedByMe)
		if order == Descending {
			return iOwned > jOwned
		}
		return iOwned < jOwned
	})
	return plans, nil
}

func sortByRecentlyAssigned(s *gin.Context, plans []*types.GLP, order SortingOrder) ([]*types.GLP, error) {
	// TODO we do a load for the GLPS and basically
	// throw them out to reload the ones that have been
	// recently assigned
	// i.e. this could be faster
	glps, err := api.GetRecentlyAssignedGLPS(s, true)
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
	case "popular":
		return sortByMostAssigned(s, plans[:], order)
	case "vis":
		return sortByAvailability(s, plans[:], order)
	case "owned":
		return sortByOwnedByMe(s, plans[:], order)
	default:
		return nil, errors.New("No such sort type '" + sortType + "'")
	}
}

func loadPlans(s *gin.Context, shouldMinify bool) ([]*types.GLP, error) {
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

func slicePlans(plans []*types.GLP, index int, step int) ([]*types.GLP, error) {
	plansLength := len(plans)

	if index >= plansLength {
		return plans, nil
	}

	stepIndex := index + step

	if (index + stepIndex) > plansLength {
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
		case "public":
			sortOrder = Public
		case "private":
			sortOrder = Private
		default:
			sortOrder = Ascending
		}

		plans, err := loadPlans(s, shouldMinify)
		if err != nil {
			log.Println("loadPlans failed", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		if sortQuery != "" {
			plans, err = sortPlans(s, plans, sortQuery, sortOrder)
			if err != nil {
				log.Println("Failed to sort GLPs by ", sortQuery, " in order ", sortOrder, "\n"+err.Error())
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
