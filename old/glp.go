package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"

	jsoniter "github.com/json-iterator/go"
)

func assignGLP(studentID string, glpID string, accessToken string) (string, error) {
	assignStruct := AssignRequest{
		StudentID: studentID,
		GLP:       glpID,
	}

	assignJSON, err := jsoniter.Marshal(assignStruct)
	if err != nil {
		return "", err
	}

	postURL := fmt.Sprintf("https://core.beaconing.eu/api/students/%s/assignedGlps?access_token=%s", studentID, accessToken)
	response, err := http.Post(postURL, "application/json", bytes.NewBuffer(assignJSON))
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
