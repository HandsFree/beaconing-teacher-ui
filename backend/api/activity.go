package api

import (
	"errors"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/activities"
)

// GetActivities looks up in the local PSQL database
// all of the activities performed by the given teacherID
//
// TODO we should cache this because
// doing an SQL query everytime is probably not
// a good idea, though im not sure if the frontend
// would do this for us since this is invoked form a GET
// request where the json response would be cached.
func GetActivities(teacherID int, count int) ([]activities.Activity, error) {
	if teacherID == -1 {
		log.Println("GetActivites, Cannot fetch activities!")
		return []activities.Activity{}, errors.New("No current user?")
	}

	if API.db == nil {
		log.Println("GetActivities, No database connection has been established")
		return []activities.Activity{}, errors.New("No database connection established")
	}

	query := "SELECT creation_date, activity_type, api_req FROM activities WHERE teacher_id = $2 LIMIT $1"
	rows, err := API.db.Query(query, count, teacherID)
	if err != nil {
		log.Println("GetActivities", err.Error())
		return []activities.Activity{}, err
	}

	loadedActivities := []activities.Activity{}
	var result activities.Activity

	log.Println("--- Loading activities!")

	for rows.Next() {
		var creationDate time.Time
		var activityType int
		var apiReq []byte

		err = rows.Scan(&creationDate, &activityType, &apiReq)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!", err.Error())
			continue
		}

		switch ActivityType(activityType) {
		case CreateStudentGroupActivity:
			result = activities.NewCreateStudentGroupActivity(apiReq)
		default:
			log.Println("-- Unhandled activity type", ActivityType(activityType))
		}

		// shouldn't happen
		if result == nil {
			continue
		}

		log.Println("-- Loaded activity", result)

		loadedActivities = append(loadedActivities, result)
	}

	return loadedActivities, nil
}

// ActivityType is a type of activity
// that can be performed, for example
// an assignment. These activities
// are displayed on the dashboard as
// "recent activities".
type ActivityType int

const (
	CreateStudentGroupActivity ActivityType = iota
	DeleteStudentGroupActivity

	CreateStudentActivity
	DeleteStudentActivity

	DeleteGLPActivity
	CreateGLPActivity
	AssignedGLPActivity
	// TODO: Unassign GLP activity
	// TODO: EditGLPActivity

	// TODO: changes a setting
	// TODO: edits a student
	// TODO: edits a group

)

// WriteActivity writes the given activity into the database. The activity database
// simply stores the type of activity, the person who executed it (teacherID) as well
// as the json that was executed (i.e the API call).
//
// in theory this could be a big old relational database but it's not really necessary
// and most of the times I feel like the JSON wont be used! this may change in the future...
func (c *CoreAPIManager) WriteActivity(teacherID int, kind ActivityType, jsonData []byte) error {
	if teacherID == -1 {
		log.Println("Cannot write activity for NULL user, skipping.")
		return errors.New("Cannot write activity for NULL user")
	}

	if c.db == nil {
		log.Println("-- No database connection has been established")
		return errors.New("No database connection")
	}

	query := "INSERT INTO activities (teacher_id, creation_date, activity_type, api_req) VALUES($1, $2, $3, $4)"
	_, err := c.db.Exec(query, teacherID, time.Now(), int(kind), jsonData)
	if err != nil {
		log.Println("-- ", err.Error())
		return err
	}

	return nil
}
