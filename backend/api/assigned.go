package api

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/lib/pq"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// FIXME move this into Parse.
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
	return string(resp), nil
}

// GetAssignedGLPS returns a JSON string of all of the
// glps that have been assigned to the given student {studentID}.
func GetAssignedGLPS(s *gin.Context, studentID uint64, includeGroups bool) string {
	// FIXME shall we support this:
	// NOTE we can set the ?includeAnalytics=true flag here if necessary.

	apiPath := API.getPath(s, "students/", fmt.Sprintf("%d", studentID), "/assignedGlps", fmt.Sprintf("?includeGroups=%s", strconv.FormatBool(includeGroups)))

	var status int
	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetAssignedGLPS", err.Error())
		return ""
	}

	if status != http.StatusOK {
		util.Info("[GetAssignedGLPS] Status Returned: ", status)
		return ""
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

	apiPath := API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID), "/assignedGlps")

	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetGroupAssignedGLPS", err.Error())
		return ""
	}
	if status != http.StatusOK {
		util.Info("[GetGroupAssignedGLPS] Status Returned: ", status)
		return ""
	}

	return string(resp)
}

// DeleteAssignedGLP deletes the given {glpID} from the {studentID}
// or "un-assigns" the glp.
func DeleteAssignedGLP(s *gin.Context, studentID uint64, linkID uint64) string {
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

	return string(resp)
}

// DeleteGroupAssignedGLP deletes the given {glpID} from the {groupID}
// or "un-assigns" the glp.
func DeleteGroupAssignedGLP(s *gin.Context, groupID uint64, glpID uint64) string {
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

	return string(resp)
}
