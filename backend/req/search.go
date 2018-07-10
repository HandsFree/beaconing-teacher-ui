package req

import (
	"fmt"
	"net/http"

	"github.com/felixangell/fuzzysearch/fuzzy"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/parse"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type searchRequestQuery struct {
	Query  string
	Filter string
	Sort   map[string]string
}

type searchQueryResponse struct {
	MatchedStudents []*entity.Student
	MatchedGLPS     []*entity.GLP
}

func searchEverything(s *gin.Context, json searchRequestQuery) (*searchQueryResponse, error) {
	studSet := make(chan []*entity.Student, 1)
	glpSet := make(chan []*entity.GLP, 1)

	go func() {
		studs, _ := searchStudents(s, json)
		studSet <- studs
	}()
	go func() {
		glps, _ := searchGLPS(s, json)
		glpSet <- glps
	}()

	return &searchQueryResponse{
		MatchedStudents: <-studSet,
		MatchedGLPS:     <-glpSet,
	}, nil
}

func searchGLPS(s *gin.Context, query searchRequestQuery) ([]*entity.GLP, error) {
	glps, err := parse.GLPS(s, true)
	if err != nil {
		util.Error("searchGLPS")
		return nil, err
	}

	sortOrder := parse.Ascending
	if sortOrderType, exists := query.Sort["order"]; exists {
		sortOrder = parse.SortOrder(sortOrderType)
	}

	// apply any sort options to the glps
	// _before_ we do the search:
	if sortType, exists := query.Sort["type"]; exists {
		sortedGlps, err := parse.SortGLPS(s, glps, sortType, sortOrder)
		if err != nil {
			util.Error("Failed to sort GLPS in searchGLPS query")
			return []*entity.GLP{}, err
		}
		glps = sortedGlps
	}

	// likewise we allocate a chunk of memory for the glps
	glpNames := make([]string, len(glps))
	glpPtrs := make([]int, len(glps))

	// NOTE: we stored "ptrs"
	// these are for index lookups because now that they
	// are in this form we don't know their index

	for idx, glp := range glps {
		glpNames = append(glpNames, glp.Name)
		glpPtrs = append(glpPtrs, idx)
	}

	matchedGLPS := []*entity.GLP{}

	glpsSearches := fuzzy.RankFindFold(query.Query, glpNames)
	for _, glpRank := range glpsSearches {
		glpIndex := glpPtrs[glpRank.Index]
		matchedGLPS = append(matchedGLPS, glps[glpIndex])
	}

	return matchedGLPS, nil
}

func searchStudents(s *gin.Context, query searchRequestQuery) ([]*entity.Student, error) {
	students, err := parse.Students(s)
	if err != nil {
		util.Error(err)
		return nil, err
	}

	studentUsernames := make([]string, len(students))
	studentFullNames := make([]string, len(students))
	studentPtrs := make([]int, len(students))

	// Now we actually append all this data
	// unfortunately there is no other way to do
	// this than a linear scan over both of the students/glps
	for idx, student := range students {
		studentUsernames = append(studentUsernames, student.Username)
		studentFullNames = append(studentFullNames, fmt.Sprintf("%s %s", student.Profile.FirstName, student.Profile.LastName))
		studentPtrs = append(studentPtrs, idx)
	}

	// so we avoid duplicate students since we
	// search both students and usernames.
	encounteredStudents := map[uint64]bool{}

	// we're probably only going to match a few
	// students and glps here so there is no
	// point over-allocating extra space
	matchedStudents := []*entity.Student{}

	// now we invoke our fancy libraries to
	// do the searches.
	studentUsernameSearch := fuzzy.RankFindFold(query.Query, studentUsernames)
	for _, studentRank := range studentUsernameSearch {
		studentIndex := studentPtrs[studentRank.Index]

		student := students[studentIndex]
		if _, ok := encounteredStudents[student.ID]; !ok {
			matchedStudents = append(matchedStudents, student)
			encounteredStudents[student.ID] = true
		}
	}

	studentFullNameSearch := fuzzy.RankFindFold(query.Query, studentFullNames)
	for _, studentRank := range studentFullNameSearch {
		studentIndex := studentPtrs[studentRank.Index]

		student := students[studentIndex]
		if _, ok := encounteredStudents[student.ID]; !ok {
			matchedStudents = append(matchedStudents, student)
			encounteredStudents[student.ID] = true
		}
	}

	return matchedStudents, nil
}

func processSearch(s *gin.Context, query searchRequestQuery) (*searchQueryResponse, error) {
	resp := &searchQueryResponse{}

	switch query.Filter {
	case "glp":
		resp.MatchedGLPS, _ = searchGLPS(s, query)
		return resp, nil
	case "student":
		resp.MatchedStudents, _ = searchStudents(s, query)
		return resp, nil
	default:
		return searchEverything(s, query)
	}
}

func PostSearchRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		var json searchRequestQuery
		if err := s.ShouldBindJSON(&json); err != nil {
			util.Error("SearchRequest", err.Error())
			s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := processSearch(s, json)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		searchJSON, err := jsoniter.Marshal(&resp)
		if err != nil {
			util.Error(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(searchJSON))
	}
}
