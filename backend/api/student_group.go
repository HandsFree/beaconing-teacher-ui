package api

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type groupStudent struct {
	ID int `json:"id"`
}

type studentGroupPostJSON struct {
	ID       int            `json:"id"`
	Name     string         `json:"name"`
	Category string         `json:"category"`
	Students []groupStudent `json:"students"`
}

// CreateStudentGroup creates a new student group
// as a post request with the given information
// defined above in {studentGroupPostJSON}.
func CreateStudentGroup(s *gin.Context) (string, error) {
	var json studentGroupPostJSON
	if err := s.ShouldBindJSON(&json); err != nil {
		util.Error("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	studentGroupPost, err := jsoniter.Marshal(json)
	if err != nil {
		util.Error("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "POST",
		API.getPath(s, "studentgroups"),
		bytes.NewBuffer(studentGroupPost),
	)
	if err != nil {
		util.Error("CreateStudentGroupPOST", err.Error())
		return "", err
	}

	if status != http.StatusCreated {
		util.Info("[CreateStudentGroup] Status Returned: ", status)
		return "", nil
	}

	return string(resp), nil
}

// GetStudentGroups gets all of the student groups
// currently registered.
func GetStudentGroups(s *gin.Context) (string, error) {
	cache := BigCacheInstance()

	resp, err := cache.Get("studentgroups")
	if err != nil {
		resp = func() []byte {
			resp, err, status := DoTimedRequest(s, "GET", API.getPath(s, "studentgroups"))
			if err != nil {
				util.Error("GetStudentGroups", err.Error())
				return []byte{}
			}
			if status != http.StatusOK {
				util.Info("[GetStudentGroups] Status Returned: ", status)
				return []byte{}
			}
			cache.Set("studentgroups", resp)
			return resp
		}()
	}
	return string(resp), nil
}

// GetStudentGroup gets all of the student groups
// currently registered.
func GetStudentGroup(s *gin.Context, groupID int) (string, error) {
	cache := LittleCacheInstance()

	apiPath := API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID))

	if resp, err := cache.Get(apiPath); err == nil {
		return string(resp), nil
	}

	resp, err, status := DoTimedRequest(s, "GET", apiPath)
	if err != nil {
		util.Error("GetStudentGroup", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[GetStudentGroups] Status Returned: ", status)
		return "", nil
	}

	cache.Set(apiPath, resp)
	return string(resp), nil
}

// DeleteStudentGroup deletes a specific student group of
// the given id {id}.
func DeleteStudentGroup(s *gin.Context, id int64) (string, error) {
	req, err, status := DoTimedRequest(s, "DELETE",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", id)),
	)
	if err != nil {
		util.Error("DeleteStudentGroup", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[DeleteStudentGroups] Status Returned: ", status)
		return "", nil
	}

	return string(req), nil
}

// PutStudentGroup updates a student group
func PutStudentGroup(s *gin.Context, groupID int) (string, error) {
	var groupJSON studentGroupPostJSON
	if err := s.ShouldBindJSON(&groupJSON); err != nil {
		util.Error("PutStudentGroup shouldBind", err.Error())
		return "", err
	}

	putJSON, err := jsoniter.Marshal(groupJSON)
	if err != nil {
		util.Error("PutStudentGroup JSON marshal", err.Error())
		return "", err
	}

	resp, err, status := DoTimedRequestBody(s, "PUT",
		API.getPath(s, "studentgroups/", fmt.Sprintf("%d", groupID)),
		bytes.NewBuffer(putJSON),
	)

	if err != nil {
		util.Error("PutStudentGroup TimedRequest", err.Error())
		return "", err
	}

	if status != http.StatusOK {
		util.Info("[PutStudentGroup] Status Returned: ", status)
		return "", nil
	}

	return string(resp), nil
}
