package req

import (
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
	"log"
	"net/http"
	"strconv"
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

	// send a response, for now just a number
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, "foo"+strconv.Itoa(fetchCount))
}
