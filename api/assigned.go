package api

import (
	"bytes"
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/serv"
	jsoniter "github.com/json-iterator/go"
)

// AssignStudentToGLP assigns the given student (by id) to the given GLP (by id),
// returns a string of the returned json from the core API as well as an error (if any).
func AssignStudentToGLP(s *serv.SessionContext, studentID int, glpID int) (string, error) {
	type assignment struct {
		StudentID int
		GlpID     int
	}

	assignJSON, err := jsoniter.Marshal(&assignment{studentID, glpID})
	if err != nil {
		return "", err
	}

	resp, err := DoTimedRequestBody("POST",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps"),
		bytes.NewBuffer(assignJSON), 5*time.Second)

	return string(resp), nil
}

func GetAssignedGLPS(s *serv.SessionContext, studentID int) string {
	resp, err := DoTimedRequest("GET",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps"),
		5*time.Second)
	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return string(resp)
}

func DeleteAssignedGLP(s *serv.SessionContext, studentID int, glpID int) string {
	resp, err := DoTimedRequest("DELETE",
		API.getPath(s,
			"students/",
			fmt.Sprintf("%d", studentID),
			"/assignedGlps/",
			fmt.Sprintf("%d", glpID)),
		5*time.Second)

	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return string(resp)
}
