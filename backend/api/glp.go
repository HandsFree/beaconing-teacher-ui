package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GetGamifiedLessonPlans requests all of the GLPs from the core
// API returned as a json string
func GetGamifiedLessonPlans(s *gin.Context) string {
	resp, err := DoTimedRequest("GET", API.getPath(s, "gamifiedlessonpaths"), 5*time.Second)
	if err != nil {
		log.Println("GetGamifiedLessonPlans", err.Error())
		return ""
	}

	response := string(resp)
	cacheData("glps", response)
	return response
}

// GetGamifiedLessonPlan requests the GLP with the given id, this function returns
// the string of json retrieved _as well as_ the parsed json object
// see types.GamifiedLessonPlan
func GetGamifiedLessonPlan(s *gin.Context, id uint64) (*types.GamifiedLessonPlan, string) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)), 5*time.Second)
	if err != nil {
		log.Println("GetGamifiedLessonPlan", err.Error())
		return nil, ""
	}

	data := &types.GamifiedLessonPlan{}
	if err := jsoniter.Unmarshal(resp, data); err != nil {
		log.Println("GetGamifiedLessonPlan", err.Error())
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, resp); err != nil {
		log.Println("GetGamifiedLessonPlan", err.Error())
	}

	return data, buffer.String()
}

func DeleteGLP(s *gin.Context, id uint64) string {
	resp, err := DoTimedRequest("DELETE",
		API.getPath(s,
			"gamifiedlessonpaths",
			fmt.Sprintf("%d", id)),
		5*time.Second)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	return string(resp)
}
