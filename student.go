package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

// TODO: add other student functions here

func getStudent(studentID string, accessToken string) (string, error) {
	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students/%s?access_token=%s", studentID, accessToken))
	if err != nil {
		return "", err
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	strJSON := string(body)

	return strJSON, nil
}

func getStudentGLPS(studentID string, accessToken string) (string, error) {
	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", studentID, accessToken))
	if err != nil {
		return "", err
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	strJSON := string(body)

	return strJSON, nil
}
