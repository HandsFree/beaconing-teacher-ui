package req

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// Delete's the assigned GLP from the student
// i.e. an un-assign operation
//
// inputs:
// - student id
// - glp id
func DeleteAssignedGLPsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		glpID, err := strconv.ParseUint(s.Param("glp"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.DeleteAssignedGLP(s, studentID, glpID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

// This returns a very different response than its 'soft' counterpart.
// specifically, an array of all of the glps, with an added 'availableFrom'
// variable
func GetAssignedGLPsHardRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		// specifies if to include glps assigned to groups
		// the student is a part of
		includeGroups, err := strconv.ParseBool(s.Query("ig"))
		if err != nil {
			util.Error("Query string 'ig' malformed", err)
		}

		assignedGlpsBody := api.GetAssignedGLPS(s, studentID, includeGroups)

		type GLPLink struct {
			Name                 string `json:"name"`
			LinkID               uint64 `json:"id"`
			ID                   uint64 `json:"gamifiedLessonPathId"`
			AvailableFrom        string `json:"availableFrom"`
			FromStudentGroupID   uint64 `json:"studentGroupId"`
			FromStudentGroupName string `json:"studentGroupName"`
		}

		var req []GLPLink
		if err := jsoniter.Unmarshal([]byte(assignedGlpsBody), &req); err != nil {
			util.Error("GetAssignedGLPsHardRequest: failed to decode assigned GLPS", err)
		}

		var wg sync.WaitGroup
		wg.Add(len(req))

		// this is basically a merged object of the entity.GLP
		// with the glp above from the assignedglps request.
		// a bit confusing, i know!
		type ModifiedGLP struct {
			*entity.GLP
			LinkID               uint64 `json:"linkId"`
			AvailableFrom        string `json:"availableFrom"`
			FromStudentGroupID   uint64 `json:"fromStudentGroupId"`
			FromStudentGroupName string `json:"fromStudentGroupName"`
		}

		glps := make([]*ModifiedGLP, len(req))
		queue := make(chan *ModifiedGLP, 1)

		for _, g := range req {
			go func(g GLPLink) {
				// TODO pass in whether or not we want
				// to minify the glp.
				res, err := api.GetGLP(s, g.ID, true)
				if err != nil {
					util.Error("Failed to retrieve GLP", err)
					return
				}

				queue <- &ModifiedGLP{
					res,
					g.LinkID,
					g.AvailableFrom,
					g.FromStudentGroupID,
					g.FromStudentGroupName,
				}
			}(g)
		}

		go func() {
			iter := 0
			for t := range queue {
				glps[iter] = t
				iter++
				wg.Done()
			}
		}()

		wg.Wait()

		body, err := jsoniter.Marshal(glps)
		if err != nil {
			util.Error(err)
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(body))
	}
}

func GetAssignedGLPsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		studentID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		// specifies if to include glps assigned to groups
		// the student is a part of
		includeGroups, err := strconv.ParseBool(s.Query("ig"))
		if err != nil {
			util.Error("Query string 'ig' malformed", err)
		}

		body := api.GetAssignedGLPS(s, studentID, includeGroups)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteGroupAssignedRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		glpID, err := strconv.ParseUint(s.Param("glp"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.DeleteGroupAssignedGLP(s, groupID, glpID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

// similar to assignedglps_hard.
func GetStudentGroupAssignedHardRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		assignedGlpsBody := api.GetGroupAssignedGLPS(s, groupID)

		type GLPLink struct {
			LinkID         uint64 `json:"id"`
			Name           string `json:"name"`
			StudentGroupID uint64 `json:"studentGroupId"`
			ID             uint64 `json:"gamifiedLessonPathId"`
			AvailableFrom  string `json:"availableFrom"`
			AvailableUntil string `json:"availableUntil"`
			Priority       string `json:"priority"`
		}

		var req []GLPLink
		if err := jsoniter.Unmarshal([]byte(assignedGlpsBody), &req); err != nil {
			util.Error("GetAssignedGLPsHardRequest: failed to decode assigned GLPS", err)
		}

		var wg sync.WaitGroup
		wg.Add(len(req))

		type ModifiedGLP struct {
			*entity.GLP
			LinkID         uint64 `json:"linkId"`
			AvailableFrom  string `json:"availableFrom"`
			AvailableUntil string `json:"availableUntil"`
		}

		glps := []*ModifiedGLP{}
		queue := make(chan *ModifiedGLP, 1)

		for _, g := range req {
			go func(g GLPLink) {
				// TODO pass in whether or not we want
				// to minify the glp.
				res, err := api.GetGLP(s, g.ID, true)
				if err != nil {
					util.Error("Failed to retrieve GLP", err)
					return
				}

				queue <- &ModifiedGLP{
					res,
					g.LinkID,
					g.AvailableFrom,
					g.AvailableUntil,
				}
			}(g)
		}

		go func() {
			for t := range queue {
				glps = append(glps, t)
				wg.Done()
			}
		}()
		close(queue)

		wg.Wait()

		body, err := jsoniter.Marshal(glps)
		if err != nil {
			util.Error(err)
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(body))
	}
}

func GetStudentGroupAssignedRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.ParseUint(s.Param("id"), 10, 64)
		if err != nil {
			s.String(http.StatusBadRequest, "No such ID thing!")
			return
		}

		body := api.GetGroupAssignedGLPS(s, groupID)
		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
