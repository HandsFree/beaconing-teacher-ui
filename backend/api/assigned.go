package api

import (
	"bytes"
	"fmt"
	"log"
	"time"

	activities "git.juddus.com/HFC/beaconing/backend/activities"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// AssignStudentToGLP assigns the given student (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignStudentToGLP(s *gin.Context, studentID uint64, glpID uint64) (string, error) {
	assignJSON, err := jsoniter.Marshal(&types.AssignPOST{studentID, glpID})
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

	API.WriteActivity(id, activities.AssignGLPActivity, resp)
	return string(resp), nil
}

// AssignGroupToGLP assigns the given group (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignGroupToGLP(s *gin.Context, groupID uint64, glpID uint64) (string, error) {
	assignJSON, err := jsoniter.Marshal(&types.AssignGroupPOST{groupID, glpID})
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

	API.WriteActivity(id, activities.AssignGLPActivity, resp)
	return string(resp), nil
}

// GetAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given student {studentID}.
func GetAssignedGLPS(s *gin.Context, studentID int) string {
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

// GetGroupAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given group {groupID}.
func GetGroupAssignedGLPS(s *gin.Context, groupID int) string {
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
func DeleteAssignedGLP(s *gin.Context, studentID int, glpID int) string {
	resp, err := DoTimedRequest(s, "DELETE",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps/",
			fmt.Sprintf("%d", glpID)),
		5*time.Second)

	if err != nil {
		log.Println("DeleteAssignedGLP", err.Error())
		return ""
	}

	return string(resp)
}

// DeleteGroupAssignedGLP deletes the given {glpID} from the {groupID}
// or "un-assigns" the glp.
func DeleteGroupAssignedGLP(s *gin.Context, groupID int, glpID int) string {
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

	return string(resp)
}
