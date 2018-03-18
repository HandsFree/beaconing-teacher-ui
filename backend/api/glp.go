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

// GetGLPS requests all of the GLPs from the core
// API returned as a json string
func GetGLPS(s *gin.Context) (string, error) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "gamifiedlessonpaths"), 10*time.Second)
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
func GetGLP(s *gin.Context, id uint64) (*types.GLP, error) {
	resp, err := DoTimedRequest("GET", API.getPath(s, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)), 5*time.Second)
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
	resp, err := DoTimedRequest("DELETE",
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
