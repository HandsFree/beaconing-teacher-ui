package api

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lib/pq"

	"github.com/HandsFree/beaconing-teacher-ui/backend/activity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// this is a little funky.
func unwrapStudentAssignObject(s *gin.Context, studentID uint64, assignID uint64) (uint64, error) {
	type Assignment struct {
		ID        uint64 `json:"id"`
		StudentID uint64 `json:"studentId"`
		GLPID     uint64 `json:"gamifiedLessonPathId"`
	}
	assignedJSON := GetStudentAssignedGLPS(s, studentID)

	var assign []Assignment
	if err := jsoniter.Unmarshal([]byte(assignedJSON), &assign); err != nil {
		util.Error(err.Error())
		return 0, err
	}

	for _, a := range assign {
		if a.ID == assignID {
			return a.GLPID, nil
		}
	}

	return 0, errors.New("No such GLP for assignID " + fmt.Sprintf("%d", assignID))
}

func removeActivePlan(s *gin.Context, planID uint64) error {
	teacherID, err := GetUserID(s)
	if err != nil {
		util.Error("No such current user (removeActivePlan)", err.Error())
		return err
	}

	util.Verbose("Removing active plan ", planID, " by ", teacherID)

	query := "DELETE FROM active_plan WHERE teacher_id = $1 AND plan = $2"
	_, err = API.db.Exec(query, teacherID, planID)
	if err != nil {
		util.Error(err.Error())
	}
	return err
}

func insertActivePlan(s *gin.Context, planID uint64) error {
	teacherID, err := GetUserID(s)
	if err != nil {
		util.Error("No such current user (insertActivePlan)", err.Error())
		return err
	}

	util.Verbose("Inserting active plan ", planID, " by ", teacherID)

	query := "INSERT INTO active_plan (creation_date, teacher_id, plan) VALUES($1, $2, $3)"
	_, err = API.db.Exec(query, time.Now(), teacherID, planID)
	if err != nil {
		util.Error(err.Error())
	}
	return err
}

// AssignStudentToGLP assigns the given student (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignStudentToGLP(s *gin.Context, studentID uint64, glpID uint64, from, to pq.NullTime) (string, error) {
	assign := &entity.AssignPOST{
		StudentID:     studentID,
		GlpID:         glpID,
		AvailableFrom: from.Time,
	}
	if to.Valid {
		assign.AvailableUntil = to.Time
	}

	assignJSON, err := jsoniter.Marshal(assign)
	if err != nil {
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "POST",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps"),
		bytes.NewBuffer(assignJSON),
	)

	fmt.Println(status)

	if status != http.StatusCreated {
		util.Info("[AssignStudentToGLP] Status Returned: ", status)
		return "", nil
	}

	id, err := GetUserID(s)
	if err != nil {
		util.Error("No such user when assigning GLP", err.Error())
		return string(resp), nil
	}

	if err := insertActivePlan(s, glpID); err != nil {
		util.Error("Failed to insert active plan")
		return string(resp), nil
	}

	API.WriteActivity(id, activity.StudentAssignGLPActivity, resp)
	return string(resp), nil
}

// AssignGroupToGLP assigns the given group (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignGroupToGLP(s *gin.Context, groupID uint64, glpID uint64, from, to time.Time) (string, error) {
	assignJSON, err := jsoniter.Marshal(&entity.AssignGroupPOST{
		GroupID:        groupID,
		GlpID:          glpID,
		AvailableFrom:  from,
		AvailableUntil: to,
	})
	if err != nil {
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "POST",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID), "/assignedGlps"),
		bytes.NewBuffer(assignJSON),
	)

	if status != http.StatusCreated {
		util.Info("[AssignGroupToGLP] Status Returned: ", status)
		return "", nil
	}

	id, err := GetUserID(s)
	if err != nil {
		util.Error("No such user when assigning GLP", err.Error())
		return string(resp), nil
	}

	if err := insertActivePlan(s, glpID); err != nil {
		util.Error("Failed to insert active plan")
		return string(resp), nil
	}

	API.WriteActivity(id, activity.GroupAssignGLPActivity, resp)
	return string(resp), nil
}

// GetAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given student {studentID}.
func GetAssignedGLPS(s *gin.Context, studentID uint64) string {
	cache := BigCacheInstance()

	// FIXME shall we support this:
	// NOTE we can set the ?includeAnalytics=true flag here if necessary.

	apiPath := API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps")

	resp, err := cache.Get(apiPath)
	if err != nil {
		resp, err, status := DoTimedRequest(s, "GET", apiPath)
		if err != nil {
			util.Error("GetAssignedGLPS", err.Error())
			return ""
		}

		if status != http.StatusOK {
			util.Info("[GetAssignedGLPS] Status Returned: ", status)
			return ""
		}

		cache.Set(apiPath, []byte(resp))
		return string(resp)
	}

	return string(resp)
}

// GetStudentAssignedGLPS ...
func GetStudentAssignedGLPS(s *gin.Context, studentID uint64) string {
	resp, err, status := DoTimedRequest(s, "GET",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps"),
	)
	if err != nil {
		util.Error("GetStudentAssignedGLPS", err.Error())
		return ""
	}
	if status != http.StatusOK {
		util.Info("[GetStudentAssignedGLPS] Status Returned: ", status)
		return ""
	}
	return string(resp)
}

// GetGroupAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given group {groupID}.
func GetGroupAssignedGLPS(s *gin.Context, groupID uint64) string {
	// NOTE / FIXME
	// we can do the following for this req:
	// includeAnalytics=true

	cache := LittleCacheInstance()
	apiPath := API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID), "/assignedGlps")

	if resp, err := cache.Get(apiPath); err == nil {
		return string(resp)
	}

	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetGroupAssignedGLPS", err.Error())
		return ""
	}
	if status != http.StatusOK {
		util.Info("[GetGroupAssignedGLPS] Status Returned: ", status)
		return ""
	}

	cache.Set(apiPath, resp)
	return string(resp)
}

// DeleteAssignedGLP deletes the given {glpID} from the {studentID}
// or "un-assigns" the glp.
func DeleteAssignedGLP(s *gin.Context, studentID uint64, linkID uint64) string {
	// NOTE we have to unwrap it _BEFORE_ we do the request
	// otherwise we will have removed the request and there will
	// be nothing for us to parse!
	glpID, err := unwrapStudentAssignObject(s, studentID, linkID)
	if err != nil {
		util.Error("Can't unwrap student assign object ", err.Error())
		return ""
	}

	if err := removeActivePlan(s, glpID); err != nil {
		util.Error("Failed to remove active plan", err.Error())
		return ""
	}

	resp, err, status := DoTimedRequest(s, "DELETE",
		API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps/", fmt.Sprintf("%d", linkID)),
	)

	if err != nil {
		util.Error("DeleteAssignedGLP", err.Error())
		return ""
	}

	if status != http.StatusOK {
		util.Info("[DeleteAssignedGLP] Status Returned: ", status)
		return ""
	}

	teacherID, err := GetUserID(s)
	if err != nil {
		util.Error("No such current user (removeActivePlan)", err.Error())
		return string(resp)
	}

	API.WriteActivity(teacherID, activity.StudentUnassignGLPActivity, resp)
	return string(resp)
}

// DeleteGroupAssignedGLP deletes the given {glpID} from the {groupID}
// or "un-assigns" the glp.
func DeleteGroupAssignedGLP(s *gin.Context, groupID uint64, glpID uint64) string {
	/* TODO

	if err := removeActivePlan(s, glpID); err != nil {
		util.Error("Failed to remove active plan", err.Error())
		return ""
	}
	*/

	resp, err, status := DoTimedRequest(s, "DELETE",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID), "/assignedGlps/", fmt.Sprintf("%d", glpID)),
	)

	if err != nil {
		util.Error("DeleteGroupAssignedGLP", err.Error())
		return ""
	}

	if status != http.StatusOK {
		util.Info("[DeleteGroupAssignedGLP] Status Returned: ", status)
		return ""
	}

	teacherID, err := GetUserID(s)
	if err != nil {
		util.Error("No such current user (removeActivePlan)", err.Error())
		return string(resp)
	}

	API.WriteActivity(teacherID, activity.GroupUnassignGLPActivity, resp)
	return string(resp)
}
