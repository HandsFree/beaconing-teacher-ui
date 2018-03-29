package api

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

const apiBaseURL string = "https://analytics.beaconing.eu/api/proxy/gleaner/data/"

func GetStudentAnalytics(s *gin.Context, id uint64) (string, error) {
	resp, err := DoTimedRequestBodyHeaders(s, "GET", fmt.Sprintf("%s/overall/%d", apiBaseURL, id), nil, 5*time.Second, map[string]string{
		"accept":        "application/json",
		"authorization": fmt.Sprintf("Bearer %s", GetAnalyticsToken(s)),
	})
	if err != nil {
		log.Println("getStudentAnalytics", err.Error())
		return "", err
	}

	log.Println("Received response from analytic api!")
	log.Println(string(resp))
	return string(resp), nil
}
