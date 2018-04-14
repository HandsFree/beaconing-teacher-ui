package api

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"time"

	activities "git.juddus.com/HFC/beaconing/backend/activities"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// this is a little funky.
// https://git.juddus.com/HFC/beaconing/issues/120
func unwrapStudentAssignObject(s *gin.Context, studentID uint64, assignID uint64) (uint64, error) {
	type Assignment struct {
		ID        uint64 `json:"id"`
		StudentID uint64 `json:"studentId"`
		GLPID     uint64 `json:"gamifiedLessonPathId"`
	}
	assignedJSON := GetStudentAssignedGLPS(s, studentID)

	var assign []Assignment
	if err := jsoniter.Unmarshal([]byte(assignedJSON), &assign); err != nil {
		log.Println(err.Error())
		return 0, err
	}

	for _, a := range assign {
		if a.ID == assignID {
			return a.GLPID, nil
		}
	}

	return 0, errors.New("No such GLP for assignID " + fmt.Sprintf("%d", assignID))
}

func removeActivePlan(s *gin.Context, planId uint64) error {
	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user (removeActivePlan)", err.Error())
		return err
	}

	log.Println("! Removing active plan ", planId, " by ", teacherId)

	query := "DELETE FROM active_plan WHERE teacher_id = $1 AND plan = $2"
	_, err = API.db.Exec(query, teacherId, planId)
	if err != nil {
		log.Println("-- ", err.Error())
	}
	return err
}

func insertActivePlan(s *gin.Context, planId uint64) error {
	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user (insertActivePlan)", err.Error())
		return err
	}

	log.Println("! Inserting active plan ", planId, " by ", teacherId)

	query := "INSERT INTO active_plan (creation_date, teacher_id, plan) VALUES($1, $2, $3)"
	_, err = API.db.Exec(query, time.Now(), teacherId, planId)
	if err != nil {
		log.Println("-- ", err.Error())
	}
	return err
}

// AssignStudentToGLP assigns the given student (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignStudentToGLP(s *gin.Context, studentID uint64, glpID uint64, from, to time.Time) (string, error) {
	assignJSON, err := jsoniter.Marshal(&types.AssignPOST{studentID, glpID, from, to})
	if err != nil {
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "POST",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps"),
		bytes.NewBuffer(assignJSON), 5*time.Second)

	id, err := GetUserID(s)
	if err != nil {
		log.Println("No such user when assigning GLP", err.Error())
		return string(resp), nil
	}

	if err := insertActivePlan(s, glpID); err != nil {
		log.Println("Failed to insert active plan")
		return string(resp), nil
	}

	API.WriteActivity(id, activities.StudentAssignGLPActivity, resp)
	return string(resp), nil
}

// AssignGroupToGLP assigns the given group (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignGroupToGLP(s *gin.Context, groupID uint64, glpID uint64, from, to time.Time) (string, error) {
	assignJSON, err := jsoniter.Marshal(&types.AssignGroupPOST{groupID, glpID, from, to})
	if err != nil {
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "POST",
		API.getPath(s,
			"studentgroups/",
			fmt.Sprintf("%d", groupID),
			"/assignedGlps"),
		bytes.NewBuffer(assignJSON), 5*time.Second)

	id, err := GetUserID(s)
	if err != nil {
		log.Println("No such user when assigning GLP", err.Error())
		return string(resp), nil
	}

	if err := insertActivePlan(s, glpID); err != nil {
		log.Println("Failed to insert active plan")
		return string(resp), nil
	}

	API.WriteActivity(id, activities.GroupAssignGLPActivity, resp)
	return string(resp), nil
}

// GetAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given student {studentID}.
func GetAssignedGLPS(s *gin.Context, studentID uint64) string {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps"),
		5*time.Second)
	if err != nil {
		log.Println("GetAssignedGLPS", err.Error())
		return ""
	}
	return string(resp)
}

func GetStudentAssignedGLPS(s *gin.Context, studentID uint64) string {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps"),
		5*time.Second)
	if err != nil {
		log.Println("GetStudentAssignedGLPS", err.Error())
		return ""
	}
	return string(resp)
}

// GetGroupAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given group {groupID}.
func GetGroupAssignedGLPS(s *gin.Context, groupID uint64) string {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s,
			"studentgroups/",
			fmt.Sprintf("%d", groupID),
			"/assignedGlps"),
		5*time.Second)
	if err != nil {
		log.Println("GetGroupAssignedGLPS", err.Error())
		return ""
	}
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
		log.Println("Can't unwrap student assign object ", err.Error())
		return ""
	}

	if err := removeActivePlan(s, glpID); err != nil {
		log.Println("Failed to remove active plan", err.Error())
		return ""
	}

	resp, err := DoTimedRequest(s, "DELETE",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps/",
			fmt.Sprintf("%d", linkID)),
		5*time.Second)

	if err != nil {
		log.Println("DeleteAssignedGLP", err.Error())
		return ""
	}

	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user (removeActivePlan)", err.Error())
		return string(resp)
	}

	API.WriteActivity(teacherId, activities.StudentUnassignGLPActivity, resp)
	return string(resp)
}

// DeleteGroupAssignedGLP deletes the given {glpID} from the {groupID}
// or "un-assigns" the glp.
func DeleteGroupAssignedGLP(s *gin.Context, groupID uint64, glpID uint64) string {
	/* TODO
	if err := removeActivePlan(s, glpID); err != nil {
		log.Println("Failed to remove active plan", err.Error())
		return ""
	}
	*/

	resp, err := DoTimedRequest(s, "DELETE",
		API.getPath(s,
			"studentgroups/",
			fmt.Sprintf("%d", groupID),
			"/assignedGlps/",
			fmt.Sprintf("%d", glpID)),
		5*time.Second)

	if err != nil {
		log.Println("DeleteGroupAssignedGLP", err.Error())
		return ""
	}

	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user (removeActivePlan)", err.Error())
		return string(resp)
	}

	API.WriteActivity(teacherId, activities.GroupUnassignGLPActivity, resp)
	return string(resp)
}
