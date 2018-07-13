package parse

import (
	"errors"
	"sort"
	"strings"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
)

// SortOrder parses the given string to the
// given sorting option. if the string fails to
// parse, will return the "Undefined" sorting option
func SortOrder(opt string) SortingOption {
	switch strings.ToLower(opt) {
	case "desc":
		return Descending
	case "asc":
		return Ascending
	case "science":
		return Sci
	case "technology":
		return Tech
	case "engineering":
		return Eng
	case "maths":
		return Maths
	case "public":
		return Public
	case "private":
		return Private
	default:
		return Undefined
	}
}

type SortingOption uint

const (
	Ascending SortingOption = iota
	Descending

	Public
	Private

	Sci
	Tech
	Eng
	Maths

	Undefined
)

func SortByName(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	sort.SliceStable(plans, func(i, j int) bool {
		if order == Descending {
			return plans[i].Name > plans[j].Name
		}

		return plans[i].Name < plans[j].Name
	})

	return plans, nil
}

func SortBySTEM(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
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

	results := []*entity.GLP{}

	for _, plan := range plans {
		if isSTEM(plan.Domain) {
			util.Verbose("Matched plan", plan.Name, " to STEM")
			results = append(results, plan)
		}
	}

	return results, nil
}

func SortByCreationTime(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[j].CreatedAt.Before(plans[i].CreatedAt)
		}
		return plans[i].CreatedAt.Before(plans[j].CreatedAt)
	})
	return plans, nil
}

func SortByRecentlyUpdated(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[j].UpdatedAt.Before(plans[i].UpdatedAt)
		}
		return plans[i].UpdatedAt.Before(plans[j].UpdatedAt)
	})
	return plans, nil
}

func SortByMostAssigned(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	glps, err := api.GetMostAssigned(s)
	if err != nil {
		util.Error("failed to get most assigned glps")
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

func SortByAvailability(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	results := []*entity.GLP{}

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

func SortByOwnedByMe(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	result := []*entity.GLP{}
	for _, pl := range plans {
		if pl.OwnedByMe {
			result = append(result, pl)
		}
	}
	return result, nil
}

func SortByRecentlyAssigned(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	// TODO we do a load for the GLPS and basically
	// throw them out to reload the ones that have been
	// recently assigned
	// i.e. this could be faster
	glps, err := api.GetRecentlyAssignedGLPS(s, true)
	if err != nil {
		util.Error("failed to get recently assigned glps")
		return plans, err
	}
	return glps, nil
}

// SortGLPS invoke sort plan with query
// ?sort=name, ?sort=stem, ?sort=created, etc.
func SortGLPS(s *gin.Context, plans []*entity.GLP, sortType string, order SortingOption) ([]*entity.GLP, error) {
	// TODO
	// sort by most assigned "popular"
	// sort by deadline soonest/further "deadline"
	// sort by recently modified "modified"
	// sort by draft? whats this.

	switch strings.ToLower(sortType) {
	case "name":
		return SortByName(s, plans[:], order)
	case "stem":
		return SortBySTEM(s, plans[:], order)
	case "created":
		return SortByCreationTime(s, plans[:], order)
	case "updated":
		return SortByRecentlyUpdated(s, plans[:], order)
	case "assigned":
		return SortByRecentlyAssigned(s, plans[:], order)
	case "popular":
		return SortByMostAssigned(s, plans[:], order)
	case "vis":
		return SortByAvailability(s, plans[:], order)
	case "owned":
		return SortByOwnedByMe(s, plans[:], order)
	default:
		return nil, errors.New("No such sort type '" + sortType + "'")
	}
}
