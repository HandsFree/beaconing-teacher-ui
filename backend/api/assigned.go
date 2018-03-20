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

	resp, err := DoTimedRequestBody("POST",
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

	API.WriteActivity(id, activities.AssignedGLPActivity, resp)
	return string(resp), nil
}

// GetAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given student {studentID}.
func GetAssignedGLPS(s *gin.Context, studentID int) string {
	resp, err := DoTimedRequest("GET",
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

// DeleteAssignedGLP deletes the given {glpID} from the {studentID}
// or "un-assigns" the glp.
func DeleteAssignedGLP(s *gin.Context, studentID int, glpID int) string {
	resp, err := DoTimedRequest("DELETE",
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
