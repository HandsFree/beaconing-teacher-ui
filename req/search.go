package req

import (
	"log"
	"net/http"

	"github.com/felixangell/fuzzysearch/fuzzy"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/paths"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"git.juddus.com/HFC/beaconing/types"
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

type SearchRequest struct {
	route.SimpleManagedRoute
}

func processSearch(s *serv.SessionContext, json SearchRequestQuery) *SearchQueryResponse {
	studentsData, studentsCached := api.Fetch("students")
	if !studentsCached {
		// cache miss, force a fetch to cache students
		studentsData, _ = api.GetStudents(s)
		// handle error!
	}

	glpData, glpsCached := api.Fetch("glps")
	if !glpsCached {
		glpData = api.GetGamifiedLessonPlans(s)
	}

	if glpData == "" || studentsData == "" {
		// TODO: some kind of error here!
		return nil
	}

	// conv json -> objects
	var students []types.Student
	if err := jsoniter.Unmarshal([]byte(studentsData), &students); err != nil {
		log.Println("processSearch", err)
		return nil
	}

	var glps []types.GamifiedLessonPlan
	if err := jsoniter.Unmarshal([]byte(glpData), &glps); err != nil {
		log.Println("processSearch", err)
		return nil
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

	return &SearchQueryResponse{matchedStudents, matchedGLPS}
}

func (r *SearchRequest) Get(s *serv.SessionContext)    {}
func (r *SearchRequest) Delete(s *serv.SessionContext) {}

func (a *SearchRequest) Post(s *serv.SessionContext) {
	var json SearchRequestQuery
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("SearchRequest", err.Error())
		s.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp := processSearch(s, json)
	if resp == nil {
		s.SimpleErrorRedirect(400, "Something went wrong!")
		return
	}
	s.Jsonify(resp)
}

func NewSearchRequest(p paths.PathSet) *SearchRequest {
	req := &SearchRequest{}
	req.SetPaths(p)
	return req
}
