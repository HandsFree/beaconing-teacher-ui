package req

import (
	"errors"
	"log"
	"net/http"

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
	MatchedGLPS     []types.GamifiedLessonPlan
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
		glpData, err = api.GetGamifiedLessonPlans(s)
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

	var glps []types.GamifiedLessonPlan
	if err := jsoniter.Unmarshal([]byte(glpData), &glps); err != nil {
		log.Println("processSearch", err)
		return nil, err
	}

	// TODO: optimize me!

	// convert our json students array to
	// a "SOA" like structure

	studentNames := []string{}
	studentPtrs := []int{}

	glpNames := []string{}
	glpPtrs := []int{}

	for idx, student := range students {
		studentNames = append(studentNames, student.Username)
		studentPtrs = append(studentPtrs, idx)
	}

	for idx, glp := range glps {
		glpNames = append(glpNames, glp.Name)
		glpPtrs = append(glpPtrs, idx)
	}

	matchedStudents := []types.Student{}
	matchedGLPS := []types.GamifiedLessonPlan{}

	studentSearches := fuzzy.RankFindFold(json.Query, studentNames)
	for _, studentRank := range studentSearches {
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
