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

// most assigned by the current user.
func GetMostAssigned(s *gin.Context) ([]*types.GLP, error) {
	if API.db == nil {
		log.Println("-- No database connection has been established")
		return nil, errors.New("No database connection")
	}

	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return []*types.GLP{}, err
	}

	// we only want to select the plans that are active
	// that have been created by the teacher that is currently
	// active
	query := "SELECT plan, count(*) FROM active_plan WHERE teacher_id = $1 GROUP BY plan ORDER BY count(*) DESC"
	rows, err := API.db.Query(query, fmt.Sprintf("%d", teacherId))
	if err != nil {
		log.Println("-- ", err.Error())
		return nil, err
	}

	popular := []*types.GLP{}
	defer rows.Close()
	for rows.Next() {
		var glpID uint64
		var count uint64

		err = rows.Scan(&glpID, &count)
		if err != nil {
			log.Println("-- Failed to request row in GetRecentlyAssigned query!", err.Error())
			continue
		}

		glp, err := GetGLP(s, glpID, true)
		if err != nil {
			log.Println("GetRecentlyAssigned", err.Error())
			continue
		}

		popular = append(popular, glp)
	}

	return popular, nil
}

func GetRecentlyAssignedGLPS(s *gin.Context) ([]*types.GLP, error) {
	if API.db == nil {
		log.Println("-- No database connection has been established")
		return nil, errors.New("No database connection")
	}

	teacherId, err := GetUserID(s)
	if err != nil {
		log.Println("No such current user", err.Error())
		return []*types.GLP{}, err
	}

	// we only want to select the plans that are active
	// that have been created by the teacher that is currently
	// active
	query := "SELECT plan FROM active_plan WHERE teacher_id = $1 GROUP BY plan, creation_date ORDER BY creation_date ASC"
	rows, err := API.db.Query(query, fmt.Sprintf("%d", teacherId))
	if err != nil {
		log.Println("-- ", err.Error())
		return nil, err
	}

	recentlyAssigned := []*types.GLP{}

	defer rows.Close()
	for rows.Next() {
		var glpID uint64

		err = rows.Scan(&glpID)
		if err != nil {
			log.Println("-- Failed to request row in GetRecentlyAssigned query!", err.Error())
			continue
		}

		glp, err := GetGLP(s, glpID, true)
		if err != nil {
			log.Println("GetRecentlyAssigned", err.Error())
			continue
		}

		recentlyAssigned = append(recentlyAssigned, glp)
	}

	if err := rows.Err(); err != nil {
		log.Println("GetRecentlyAssignedGLPS DB Error", err.Error())
		return nil, err
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
			fmt.Sprintf("?noContent=%s", strconv.FormatBool(minify))),
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
