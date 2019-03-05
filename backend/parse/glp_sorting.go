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
func SortOrder(opt string) []SortingOption {
	sorts := strings.Split(opt, ",")

	results := make([]SortingOption, len(sorts))

	for idx, sort := range sorts {
		result := func(opt string) SortingOption {
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
			case "null":
				fallthrough
			default:
				return Undefined
			}
		}(sort)

		results[idx] = result
	}

	return results
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
	sort.Slice(plans, func(i, j int) bool {
		if order == Descending {
			return plans[i].Name > plans[j].Name
		}

		return plans[i].Name < plans[j].Name
	})

	return plans, nil
}

// FilterByTopic will filter down to a set of plans with
// 'Topics' that match the given value. Note the search is
// case insensitive and is not _exact_ matching.
func FilterByTopic(s *gin.Context, plans []*entity.GLP, val string) ([]*entity.GLP, error) {
	results := []*entity.GLP{}
	for _, plan := range plans {
		// check for prefix rather than equals for some
		// more lenient matching.
		// TODO fixme.
		topic := strings.ToLower(plan.Topic)
		if strings.HasPrefix(topic, val) {
			results = append(results, plan)
		}
	}
	return results, nil
}

func FilterByExactDomain(s *gin.Context, plans []*entity.GLP, val string) ([]*entity.GLP, error) {
	results := []*entity.GLP{}
	for _, plan := range plans {
		// check for prefix rather than equals for some
		// more lenient matching.
		// TODO fixme.
		domain := strings.ToLower(plan.Domain)
		if strings.Compare(domain, val) == 0 {
			results = append(results, plan)
		}
	}
	return results, nil
}

func FilterByDomain(s *gin.Context, plans []*entity.GLP, val string) ([]*entity.GLP, error) {
	results := []*entity.GLP{}
	for _, plan := range plans {
		// check for prefix rather than equals for some
		// more lenient matching.
		// TODO fixme.
		domain := strings.ToLower(plan.Domain)
		if strings.HasPrefix(domain, val) {
			results = append(results, plan)
		}
	}
	return results, nil
}

func SortBySTEM(s *gin.Context, plans []*entity.GLP, order SortingOption) ([]*entity.GLP, error) {
	switch order {
	case Sci:
		return FilterByExactDomain(s, plans, "science")
	case Tech:
		return FilterByExactDomain(s, plans, "technology")
	case Eng:
		return FilterByExactDomain(s, plans, "engineering")
	case Maths:
		return FilterByExactDomain(s, plans, "maths")
	default:
		return []*entity.GLP{}, nil
	}
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
			switch order {
			case Ascending:
				result = append(result, pl)
			case Descending:
				result = append([]*entity.GLP{pl}, result...)
			default:
				result = append(result, pl)
			}
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

type sortable []string

// the lower the value, the higher
// the precedence.
var precedence = map[string]int{
	"owned":    7,
	"stem":     6,
	"vis":      5,
	"updated":  4,
	"popular":  3,
	"assigned": 2,
	"created":  1,
	"name":     0,
}

func (s sortable) Len() int { return len(s) }

func (s sortable) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s sortable) Less(i, j int) bool {
	a, b := s[i], s[j]
	aPrec, _ := precedence[a]
	bPrec, _ := precedence[b]
	return aPrec < bPrec
}

// SortGLPS invoke sort plan with query
// ?sort=name, ?sort=stem, ?sort=created, etc.
func SortGLPS(s *gin.Context, plans []*entity.GLP, sortType string, orders []SortingOption) ([]*entity.GLP, error) {
	// TODO
	// sort by most assigned "popular"
	// sort by deadline soonest/further "deadline"
	// sort by recently modified "modified"
	// sort by draft? whats this.

	// this sort function will do the correct sort given the
	// sort type...
	doSort := func(planSet []*entity.GLP, sortType string, order SortingOption) ([]*entity.GLP, error) {
		switch strings.ToLower(sortType) {
		case "name":
			return SortByName(s, planSet[:], order)
		case "stem":
			return SortBySTEM(s, planSet[:], order)
		case "created":
			return SortByCreationTime(s, planSet[:], order)
		case "updated":
			return SortByRecentlyUpdated(s, planSet[:], order)
		case "assigned":
			return SortByRecentlyAssigned(s, planSet[:], order)
		case "popular":
			return SortByMostAssigned(s, planSet[:], order)
		case "vis":
			return SortByAvailability(s, planSet[:], order)
		case "owned":
			return SortByOwnedByMe(s, planSet[:], order)
		default:
			return nil, errors.New("No such sort type '" + sortType + "'")
		}
	}

	// cut all of the sorting options out of the URL
	sorts := strings.Split(sortType, ",")

	// we sort the sorting options so that they are
	// in order of precedence.
	// the frontend will send us the options and they could have
	// been applied in any order.
	// we need to make sure that we sort these so that for example
	// we check for things like if it's a STEM plan last
	// otherwise we might not have any plans to check if they are a STEM in the
	// first place.
	sort.Sort(sortable(sorts))

	var anyError error
	startingPlans := plans

	for i, sort := range sorts {
		result, err := doSort(startingPlans, sort, orders[i])
		if err != nil {
			util.Error("Failed to do sort ", err)
			// skip the phase.
			anyError = err
			continue
		}
		// success! mutate the starting plans
		startingPlans = result
	}

	return startingPlans, anyError
}
