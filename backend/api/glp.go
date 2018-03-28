package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"git.juddus.com/HFC/beaconing/backend/activities"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"github.com/olekukonko/tablewriter"
)

func containsGLP(glpID uint64, glpArr []*types.GLP) bool {
	for _, glp := range glpArr {
		if glp.ID == glpID {
			return true
		}
	}

	return false
}

type glpPostJSON struct {
	Name               string   `json:"name"`
	Description        string   `json:"description"`
	Author             string   `json:"author"`
	Category           string   `json:"category"`
	Domain             string   `json:"domain"`
	Topic              string   `json:"topic"`
	AgeGroup           string   `json:"ageGroup"`
	Year               int      `json:"year"`
	LearningObjectives []string `json:"learningObjectives"`
	Competences        []string `json:"competences"`
	Public             bool     `json:"public"`
}

func CreateGLP(s *gin.Context) (string, error) {
	var json glpPostJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		log.Println("CreateGLP", err.Error())
		return "", err
	}

	glpPost, err := jsoniter.Marshal(json)
	if err != nil {
		log.Println("CreateGLP", err.Error())
		return "", err
	}

	resp, err := DoTimedRequestBody(s, "POST",
		API.getPath(s, "gamifiedlessonpaths"),
		bytes.NewBuffer(glpPost),
		5*time.Second)
	if err != nil {
		log.Println("CreateGLP", err.Error())
		return "", err
	}

	id, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return string(resp), err
	}

	// TODO write activity for glp request.
	_ = id

	return string(resp), nil
}

func GetRecentlyAssignedGLPS(s *gin.Context) ([]*types.GLP, error) {
	if API.db == nil {
		log.Println("-- No database connection has been established")
		return nil, errors.New("No database connection")
	}

	query := "SELECT api_req FROM activities WHERE activity_type = $1 ORDER BY creation_date ASC"
	rows, err := API.db.Query(query, fmt.Sprintf("%d", int(activities.AssignGLPActivity)))
	if err != nil {
		log.Println("-- ", err.Error())
		return nil, err
	}

	recentlyAssigned := []*types.GLP{}

	for rows.Next() {
		var apiReq []byte

		err = rows.Scan(&apiReq)
		if err != nil {
			log.Println("-- Failed to request row in GetActivities query!", err.Error())
			continue
		}

		var glpReq types.AssignActivity
		jsoniter.Unmarshal(apiReq, &glpReq)

		glp, err := GetGLP(s, glpReq.GlpID, true)
		if err != nil {
			log.Println("GetRecentlyAssigned", err.Error())
			continue
		}

		if glpReq.GlpID == 0 {
			continue
		}

		// log.Println(glpReq.GlpID)
		contains := containsGLP(glpReq.GlpID, recentlyAssigned)
		if contains {
			continue
		}

		recentlyAssigned = append(recentlyAssigned, glp)
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Active GLPs"})
	for _, glp := range recentlyAssigned {
		table.Append([]string{fmt.Sprintf("%d", glp.ID)})
	}
	table.Render()

	return recentlyAssigned, nil
}

// GetGLPS requests all of the GLPs from the core
// API returned as a json string
func GetGLPS(s *gin.Context, minify bool) (string, error) {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s,
			"gamifiedlessonpaths/",
			fmt.Sprintf("?noContent=%s", strconv.FormatBool(minify))),
		10*time.Second)
	if err != nil {
		log.Println("GetGLPS", err.Error())
		return "", err
	}

	response := string(resp)
	cacheData("glps", response)
	return response, nil
}

// GetGLP requests the GLP with the given id, this function returns
// the string of json retrieved _as well as_ the parsed json object
// see types.GLP
func GetGLP(s *gin.Context, id uint64, minify bool) (*types.GLP, error) {
	resp, err := DoTimedRequest(s, "GET",
		API.getPath(s,
			"gamifiedlessonpaths/",
			fmt.Sprintf("%d", id),
			fmt.Sprintf("?noContent=%s"), strconv.FormatBool(minify)),
		5*time.Second)
	if err != nil {
		log.Println("GetGLP", err.Error())
		return nil, err
	}

	data := &types.GLP{}
	if err := jsoniter.Unmarshal(resp, data); err != nil {
		log.Println("GetGLP", err.Error())
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, resp); err != nil {
		log.Println("GetGLP", err.Error())
	}

	return data, nil
}

// DeleteGLP deletes the given GLP of {id} from the
// core database.
func DeleteGLP(s *gin.Context, id uint64) (string, error) {
	resp, err := DoTimedRequest(s, "DELETE",
		API.getPath(s,
			"gamifiedlessonpaths",
			fmt.Sprintf("%d", id)),
		5*time.Second)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	return string(resp), nil
}
