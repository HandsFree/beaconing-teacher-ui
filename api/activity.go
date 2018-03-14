package api

import (
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/types"
)

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
		var creation_date time.Time
		var activity_type int
		var api_req []byte

		err = rows.Scan(&creation_date, &activity_type, &api_req)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!")
			continue
		}

		switch ActivityType(activity_type) {
		case Create_Student:
			result = types.NewCreateStudentActivity(api_req)
		default:
			log.Println("-- Unhandled activity type", ActivityType(activity_type))
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

type ActivityType int

const (
	Create_Student ActivityType = iota
)

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
