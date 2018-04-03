package req

import (
	"errors"
	"log"
	"net/http"
	"fmt"

	"github.com/felixangell/fuzzysearch/fuzzy"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type SearchRequestQuery struct {
	Query string
}

type SearchQueryResponse struct {
	MatchedStudents []types.Student
	MatchedGLPS     []types.GLP
}

func processSearch(s *gin.Context, json SearchRequestQuery) (*SearchQueryResponse, error) {
	studentsData, studentsCached := api.Fetch("students")
	if !studentsCached {
		// cache miss, force a fetch to cache students
		studentsData, _ = api.GetStudents(s)
		// handle error!
	}

	glpData, glpsCached := api.Fetch("glps")
	if !glpsCached {
		var err error
		glpData, err = api.GetGLPS(s, true)
		if err != nil {
			log.Println("processSearch", err.Error())
			return nil, err
		}
	}

	if glpData == "" || studentsData == "" {
		return nil, errors.New("No student/GLP data")
	}

	// conv json -> objects
	var students []types.Student
	if err := jsoniter.Unmarshal([]byte(studentsData), &students); err != nil {
		log.Println("processSearch", err)
		return nil, err
	}

	var glps []types.GLP
	if err := jsoniter.Unmarshal([]byte(glpData), &glps); err != nil {
		log.Println("processSearch", err)
		return nil, err
	}

	// TODO: optimize me!

	// convert our json students array to
	// a "SOA" like structure for that sweet
	// sweet cache performance

	// basically we need to make it into a format
	// that our searching library will accept so
	// we convert it into a bunch of arrays
	//
	// one optimisation is that we know the length
	// of students so we can allocate a chunk of memory
	// rather than an empty array and keep resizing it
	studentUsernames := make([]string, len(students))
	studentFullNames := make([]string, len(students))
	studentPtrs := make([]int, len(students))

	// likewise we allocate a chunk of memory for the glps
	glpNames := make([]string, len(glps))
	glpPtrs := make([]int, len(glps))

	// NOTE: we stored "ptrs"
	// these are for index lookups because now that they
	// are in this form we don't know their index

	// Now we actually append all this data
	// unfortunately there is no other way to do
	// this than a linear scan over both of the students/glps
	for idx, student := range students {
		studentUsernames = append(studentUsernames, student.Username)
		studentFullNames = append(studentFullNames, fmt.Sprintf("%s %s", student.Profile.FirstName, student.Profile.LastName))
		studentPtrs = append(studentPtrs, idx)
	}

	for idx, glp := range glps {
		glpNames = append(glpNames, glp.Name)
		glpPtrs = append(glpPtrs, idx)
	}

	// we're probably only going to match a few
	// students and glps here so there is no
	// point over-allocating!
	matchedStudents := []types.Student{}
	matchedGLPS := []types.GLP{}

	// now we invoke our fancy libraries to
	// do the searches.
	studentUsernameSearch := fuzzy.RankFindFold(json.Query, studentUsernames)
	for _, studentRank := range studentUsernameSearch {
		studentIndex := studentPtrs[studentRank.Index]
		matchedStudents = append(matchedStudents, students[studentIndex])
	}

	studentFullNameSearch := fuzzy.RankFindFold(json.Query, studentFullNames)
	for _, studentRank := range studentFullNameSearch {
		studentIndex := studentPtrs[studentRank.Index]
		matchedStudents = append(matchedStudents, students[studentIndex])
	}

	glpsSearches := fuzzy.RankFindFold(json.Query, glpNames)
	for _, glpRank := range glpsSearches {
		glpIndex := glpPtrs[glpRank.Index]
		matchedGLPS = append(matchedGLPS, glps[glpIndex])
	}

	return &SearchQueryResponse{matchedStudents, matchedGLPS}, nil
}

func PostSearchRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		var json SearchRequestQuery
		if err := s.ShouldBindJSON(&json); err != nil {
			log.Println("SearchRequest", err.Error())
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
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(searchJSON))
	}
}
