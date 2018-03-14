package api

import (
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/types"
)

// GetActivities looks up in the local PSQL database
// all of the activities performed by the given teacherID
//
// TODO we should cache this because
// doing an SQL query everytime is probably not
// a good idea, though im not sure if the frontend
// would do this for us since this is invoked form a GET
// request where the json response would be cached.
func GetActivities(teacherID int, count int) []types.Activity {
	if teacherID == -1 {
		log.Println("-- Cannot fetch activities!")
		return []types.Activity{}
	}

	if API.db == nil {
		log.Println("-- No database connection has been established")
		return []types.Activity{}
	}

	query := "SELECT creation_date, activity_type, api_req FROM activities WHERE teacher_id = $2 LIMIT $1"
	rows, err := API.db.Query(query, count, teacherID)
	if err != nil {
		log.Println("GetActivities", err.Error())
		return []types.Activity{}
	}

	activities := []types.Activity{}
	var result types.Activity

	log.Println("--- Loading activities!")

	for rows.Next() {
		var creationDate time.Time
		var activityType int
		var apiReq []byte

		err = rows.Scan(&creationDate, &activityType, &apiReq)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!")
			continue
		}

		switch ActivityType(activityType) {
		case CreateStudent:
			result = types.NewCreateStudentActivity(apiReq)
		default:
			log.Println("-- Unhandled activity type", ActivityType(activityType))
		}

		// shouldn't happen
		if result == nil {
			continue
		}

		log.Println("-- Loaded activity", result)

		activities = append(activities, result)
	}

	return activities
}

// ActivityType is a type of activity
// that can be performed, for example
// an assignment. These activities
// are displayed on the dashboard as
// "recent activities".
type ActivityType int

const (
	// CreateStudent is created when
	// a teacher creates a new student.
	CreateStudent ActivityType = iota
)

// WriteActivity writes the given activity into the database. The activity database
// simply stores the type of activity, the person who executed it (teacherID) as well
// as the json that was executed (i.e the API call).
//
// in theory this could be a big old relational database but it's not really necessary
// and most of the times I feel like the JSON wont be used! this may change in the future...
func (c *CoreAPIManager) WriteActivity(teacherID int, kind ActivityType, jsonData []byte) {
	if teacherID == -1 {
		log.Println("Cannot write activity for NULL user, skipping.")
		return
	}

	if c.db == nil {
		log.Println("-- No database connection has been established")
		return
	}

	// TODO store the activity type!

	query := "INSERT INTO activities (teacher_id, creation_date, activity_type, api_req) VALUES($1, $2, $3, $4)"
	_, err := c.db.Exec(query, teacherID, time.Now(), int(kind), jsonData)
	if err != nil {
		log.Println("-- ", err.Error())
	}
}
