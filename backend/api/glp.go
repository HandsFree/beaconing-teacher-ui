package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func containsGLP(glpID uint64, glpArr []*entity.GLP) bool {
	for _, glp := range glpArr {
		if glp.ID == glpID {
			return true
		}
	}

	return false
}

// To be used later on
// type glpPutJSON struct {
// 	ID                 uint64    `json:"id"`
// 	Name               string    `json:"name"`
// 	Desc               string    `json:"description"`
// 	Author             string    `json:"author"`
// 	Category           string    `json:"category"`
// 	Domain             string    `json:"domain"`
// 	Topic              string    `json:"topic"`
// 	AgeGroup           string    `json:"ageGroup"`
// 	Year               int       `json:"year"`
// 	LearningObjectives []string  `json:"learningObjectives"`
// 	Competences        []string  `json:"competences"`
// 	Content            string    `json:"content"`
// 	Public             bool      `json:"public"`
// 	GamePlotID         int       `json:"gamePlotId"`
// 	ExternConfig       string    `json:"externConfig"`
// 	CreatedAt          time.Time `json:"createdAt"`
// 	UpdatedAt          time.Time `json:"updatedAt"`
// 	Owner              string    `json:"owner"`
// 	OwnedByMe          bool      `json:"ownedByMe"`
// 	ReadOnly           bool      `json:"readOnly"`
// }

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
	GamePlotID         int      `json:"gamePlotId"`
	ExternConfig       string   `json:"externConfig"`
}

// PutGLP ...
func PutGLP(s *gin.Context, id int) (string, error) {
	var json glpPostJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		util.Error("PutGLP", err.Error())
		return "", err
	}

	glpPut, err := jsoniter.Marshal(json)
	if err != nil {
		util.Error("PutGLP", err.Error())
		return "", err
	}

	apiPath := API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id))
	resp, err, status := DoTimedRequestBody(s, "PUT",
		apiPath,
		bytes.NewBuffer(glpPut),
	)
	if err != nil {
		util.Error("PutGLP", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[PutGLP] Status Returned: ", status)
		return "", nil
	}

	return string(resp), nil
}

// CreateGLP handles the CreateGLP POST request.
func CreateGLP(s *gin.Context) (string, error) {
	var json glpPostJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		util.Error("CreateGLP", err.Error())
		return "", err
	}

	glpPost, err := jsoniter.Marshal(json)
	if err != nil {
		util.Error("CreateGLP", err.Error())
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "POST",
		API.getPath(s, "gamifiedlessonpaths"),
		bytes.NewBuffer(glpPost),
	)
	if err != nil {
		util.Error("CreateGLP", err.Error())
		return "", err
	}

	if status != http.StatusCreated {
		util.Info("[CreateGLP] Status Returned: ", status)
		return "", nil
	}

	id, err := GetUserID(s)
	if err != nil {
		util.Error("No such current user", err.Error())
		return string(resp), err
	}

	return string(resp), nil
}

// GetGLPS requests all of the GLPs from the core
// API returned as a json string
func GetGLPS(s *gin.Context, minify bool) (string, error) {
	cache := BigCacheInstance()
	apiPath := API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("?noContent=%s", strconv.FormatBool(minify)))

	resp, err := cache.Get(apiPath)
	if err == nil {
		return string(resp), nil
	}

	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetGLPS", err.Error())
		return "", err
	}
	if status != http.StatusOK {
		util.Info("[GetGLPS] Status Returned: ", status)
		return "", nil
	}

	cache.Set(apiPath, resp)
	return string(resp), nil
}

// GetGLP requests the GLP with the given id, this function returns
// the string of json retrieved _as well as_ the parsed json object
// see entity.GLP
func GetGLP(s *gin.Context, id uint64, minify bool) (*entity.GLP, error) {
	cache := LittleCacheInstance()

	apiPath := API.getPath(s, "gamifiedlessonpaths/",
		fmt.Sprintf("%d", id),
		fmt.Sprintf("?noContent=%s", strconv.FormatBool(minify)))

	doCache := func(cache *CacheWrapper) []byte {
		resp, err, status := DoTimedRequest(s, "GET", apiPath)

		if err != nil {
			util.Error("GetGLP", err.Error())
			return []byte{}
		}

		if status != http.StatusOK {
			util.Info("[GetGLP] Status Returned: ", status)
			return []byte{}
		}

		payLoad := []byte(resp)
		cache.Set(apiPath, payLoad)
		return payLoad
	}

	resp, err := cache.Get(apiPath)
	if err != nil {
		resp = doCache(cache)
	}

	data := &entity.GLP{}
	if err := jsoniter.Unmarshal(resp, data); err != nil {
		// bad cache data. recache
		doCache(cache)

		util.Error("GetGLP", err.Error())
		return nil, err
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, resp); err != nil {
		util.Error("GetGLP", err.Error())
		return nil, err
	}

	return data, nil
}

// DeleteGLP deletes the given GLP of {id} from the
// core database.
func DeleteGLP(s *gin.Context, id uint64) (string, error) {
	resp, err, status := DoTimedRequest(s, "DELETE",
		API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)),
	)
	if err != nil {
		util.Error(err)
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[DeleteGLP] Status Returned: ", status)
		return "", nil
	}

	return string(resp), nil
}
