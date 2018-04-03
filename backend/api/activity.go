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
func GetActivities(teacherID uint64, count int) ([]activities.Activity, error) {
	if API.db == nil {
		log.Println("GetActivities, No database connection has been established")
		return []activities.Activity{}, errors.New("No database connection established")
	}

	query := "SELECT creation_date, activity_type, api_req FROM activity WHERE teacher_id = $2 LIMIT $1"
	rows, err := API.db.Query(query, count, teacherID)
	if err != nil {
		log.Println("GetActivities", err.Error())
		return []activities.Activity{}, err
	}

	loadedActivities := []activities.Activity{}
	var result activities.Activity

	log.Println("--- Loading activities!")

	defer rows.Close()
	for rows.Next() {
		var creationDate time.Time
		var activityType int
		var apiReq []byte

		err = rows.Scan(&creationDate, &activityType, &apiReq)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!", err.Error())
			continue
		}

		switch activities.ActivityType(activityType) {
		case activities.CreateStudentGroupActivity:
			result = activities.NewCreateStudentGroupActivity(apiReq)
		case activities.DeleteStudentGroupActivity:
			result = activities.NewDeleteStudentGroupActivity(apiReq)

		case activities.CreateStudentActivity:
			result = activities.NewDeleteStudentActivity(apiReq)
		case activities.DeleteStudentActivity:
			result = activities.NewDeleteStudentActivity(apiReq)

		case activities.DeleteGLPActivity:
			result = activities.NewDeleteGLPActivity(apiReq)
		case activities.CreateGLPActivity:
			result = activities.NewCreateGLPActivity(apiReq)
		case activities.AssignGLPActivity:
			result = activities.NewAssignedGLPActivity(apiReq)
		case activities.UnassignGLPActivity:
			result = activities.NewUnassignedGLPActivity(apiReq)		
		default:
			log.Println("-- Unhandled activity type", activities.ActivityType(activityType))
		}

		// shouldn't happen
		if result == nil {
			continue
		}

		result.SetExecutionTime(creationDate)

		log.Println("-- Loaded activity", result)

		loadedActivities = append(loadedActivities, result)
	}

	if err := rows.Err(); err != nil {
		log.Println("GetActivities DB Error", err.Error())
		return []activities.Activity{}, err
	}

	return loadedActivities, nil
}

// WriteActivity writes the given activity into the database. The activity database
// simply stores the type of activity, the person who executed it (teacherID) as well
// as the json that was executed (i.e the API call).
//
// in theory this could be a big old relational database but it's not really necessary
// and most of the times I feel like the JSON wont be used! this may change in the future...
func (c *CoreAPIManager) WriteActivity(teacherID uint64, kind activities.ActivityType, jsonData []byte) error {
	if c.db == nil {
		log.Println("-- No database connection has been established")
		return errors.New("No database connection")
	}

	query := "INSERT INTO activity (teacher_id, creation_date, activity_type, api_req) VALUES($1, $2, $3, $4)"
	_, err := c.db.Exec(query, teacherID, time.Now(), int(kind), jsonData)
	if err != nil {
		log.Println("-- ", err.Error())
		return err
	}

	return nil
}
