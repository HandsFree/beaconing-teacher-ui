package api

import (
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/serv"
)

// GetStudents requests a list of all students from the
// core api, returned as a string of json
func GetStudents(s *serv.SessionContext) string {
	resp, err := DoTimedRequest("GET", API.getPath(s, "students"), 5*time.Second)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	body := string(resp)
	cacheData("students", body)
	return body
}

func GetStudent(s *serv.SessionContext, studentID int) string {
	response, err := DoTimedRequest("GET", API.getPath(s, "students/", fmt.Sprintf("%d", studentID)), 5*time.Second)
	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return string(response)
}
