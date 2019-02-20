package req

import (
	"math/rand"
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func GetStudentOverview() gin.HandlerFunc {
	return func(s *gin.Context) {
		fetchCount, err := strconv.Atoi(s.DefaultQuery("count", "3"))
		if err != nil || fetchCount <= 0 {
			// NaN or improper data
			fetchCount = 3
			util.Warn("warning, fetchCount has an illegal value")
		}

		// TODO: request students, make sure they are sorted
		// best to worst (or worst to best depending on ctx)
		req := StudentOverviewJSON{
			BestPerforming:  genDummyStudentData(fetchCount),
			NeedsAttention:  genDummyStudentData(fetchCount),
			MostImprovement: genDummyStudentData(fetchCount),
		}

		json, err := jsoniter.Marshal(req)
		if err != nil {
			util.Error(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(json))
	}
}

type StudentData struct {
	Name              string `json:"name"`
	OverallPercentage int    `json:"overall_percentage"`
}

/*

	parameters:

		count (default is 3)
		TODO: time spans of data

	response:

		best_performing {
			{
				name: Felix,
				overall_percentage: 93,
			},
			{

			},
			... students
		},
		needs_attention {
			{
				name: Elliott,
				overall_percentage: 12,
			}
		},
		most_improvement {

		},

*/

type StudentOverviewJSON struct {
	BestPerforming  []*StudentData `json:"best_performing"`
	NeedsAttention  []*StudentData `json:"needs_attention"`
	MostImprovement []*StudentData `json:"most_improvement"`
}

func newDummyStudent() *StudentData {
	student := &StudentData{
		Name:              randStrSeq(8),
		OverallPercentage: rand.Intn(100),
	}
	return student
}

// _for now_ will load ALL of the students in the API
// but this should only load students that the teacher
// teaches.
// ..
// ..
// load ALL students in the API, sorts by best performing
// needs attention, most improvement, picks top (?count=) N students
func fetchStudentOverview(count int) []StudentData {
	students := []StudentData{}

	return students
}

func genDummyStudentData(count int) []*StudentData {
	result := []*StudentData{}
	for i := 0; i < count; i++ {
		result = append(result, newDummyStudent())
	}
	return result
}

// TEMPORARY!

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randStrSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
