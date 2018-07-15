package api

import (
	"errors"
	"time"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
)

// GetActivities looks up in the local PSQL database
// all of the activities performed by the given teacherID
//
// TODO we should cache this because
// doing an SQL query everytime is probably not
// a good idea, though im not sure if the frontend
// would do this for us since this is invoked form a GET
// request where the json response would be cached.
func GetActivities(teacherID uint64, count int) ([]activity.Activity, error) {
	if API.db == nil {
		util.Error("GetActivities, No database connection has been established")
		return []activity.Activity{}, errors.New("No database connection established")
	}

	query := "SELECT * FROM (SELECT id, creation_date, activity_type, api_req FROM activity WHERE teacher_id = $2) AS activities ORDER BY activities.id DESC LIMIT $1"
	rows, err := API.db.Query(query, count, teacherID)
	if err != nil {
		util.Error("GetActivities", err.Error())
		return []activity.Activity{}, err
	}

	loadedActivities := []activity.Activity{}

	defer rows.Close()
	for rows.Next() {
		var id int
		var creationDate time.Time
		var activityType int
		var apiReq []byte

		err = rows.Scan(&id, &creationDate, &activityType, &apiReq)
		if err != nil {
			util.Error("-- Failed to request row in GetActivities query!", err.Error())
			continue
		}

		// TODO felix clean this system up a whole lot more.

		result := activity.Parse(activity.ActivityType(activityType), apiReq)
		// shouldn't happen
		if result == nil {
			continue
		}

		result.SetExecutionTime(creationDate)

		util.Verbose("Loaded activity", result.GetName())

		loadedActivities = append(loadedActivities, result)
	}

	if err := rows.Err(); err != nil {
		util.Error("GetActivities DB Error", err.Error())
		return []activity.Activity{}, err
	}

	return loadedActivities, nil
}

// WriteActivity writes the given activity into the database. The activity database
// simply stores the type of activity, the person who executed it (teacherID) as well
// as the json that was executed (i.e the API call).
//
// in theory this could be a big old relational database but it's not really necessary
// and most of the times I feel like the JSON wont be used! this may change in the future...
func (c *CoreAPIManager) WriteActivity(teacherID uint64, kind activity.ActivityType, jsonData []byte) error {
	if c.db == nil {
		util.Error("-- No database connection has been established")
		return errors.New("No database connection")
	}

	when := time.Now()

	query := "INSERT INTO activity (teacher_id, creation_date, activity_type, api_req) VALUES($1, $2, $3, $4)"
	_, err := c.db.Exec(query, teacherID, when, int(kind), jsonData)
	if err != nil {
		util.Error("-- ", err.Error())
		return err
	}

	util.Verbose("Wrote activity ", string(kind), " at ", when)

	return nil
}
