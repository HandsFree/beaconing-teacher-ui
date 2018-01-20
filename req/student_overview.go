package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"net/http"
	"math/rand"
	"strconv"
	"log"
	jsoniter "github.com/json-iterator/go"
)

type StudentOverview struct {
	route.SimpleManagedRoute
}

func NewStudentOverview(path string) *StudentOverview {
	req := &StudentOverview{}
	req.SetPath(path)
	return req
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

type StudentOverviewData struct {
	Name string `json:"name"`
	OverallPercentage int `json:"overall_percentage"`
}

// DELETE ME!
var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
func randStrSeq(n int) string {
    b := make([]rune, n)
    for i := range b {
        b[i] = letters[rand.Intn(len(letters))]
    }
    return string(b)
}

func newDummyStudent() *StudentOverviewData {
	student := &StudentOverviewData{
		Name: randStrSeq(8),
		OverallPercentage: rand.Intn(100),
	}
	log.Println("made a student:", student)
	return student
}

type StudentOverviewJSON struct {
	BestPerforming []*StudentOverviewData	`json:"best_performing"`
	NeedsAttention []*StudentOverviewData	`json:"needs_attention"`
	MostImprovement []*StudentOverviewData	`json:"most_improvement"`
}

func genDummyStudentData(count int) []*StudentOverviewData {
	result := []*StudentOverviewData{}
	for i := 0; i < count; i++ {
		result = append(result, newDummyStudent())
	}
	return result
}

func (r *StudentOverview) Handle(s *serv.SessionContext) {
	countParam := s.DefaultQuery("count", "3")

	fetchCount, err := strconv.Atoi(countParam)
	if err != nil {
		// it's not a number, set it to 3.
		fetchCount = 3

		// TODO better log message!
	}

	// no cheeky negatives, must fetch at least 1 student.
	if fetchCount <= 0 {
		fetchCount = 3
	}

	// TODO: request students, make sure they are sorted
	// best to worst (or worst to best depending on ctx)
	req := StudentOverviewJSON{
		BestPerforming: genDummyStudentData(fetchCount),
		NeedsAttention: genDummyStudentData(fetchCount),
		MostImprovement: genDummyStudentData(fetchCount),
	}

	json, err := jsoniter.Marshal(&req)
    if err != nil {
    	// TODO proper error handling
    	log.Fatal(err)
        return
    }

	// send a response, for now just a number
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(json))
}
