package req

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func sortStudentGroups(groups []*entity.StudentGroup, filterBy string, match string) []*entity.StudentGroup {
	switch filterBy {
	case "category":
		result := []*entity.StudentGroup{}
		for _, grp := range groups {
			if strings.Compare(grp.Category, match) == 0 {
				result = append(result, grp)
			}
		}
		return result
	default:
		util.Error("Attempted to sort student groups by", filterBy, "=>", match)
		// NOP
		return groups
	}
}

func PostStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.CreateStudentGroup(s)
		if err != nil {
			util.Error("PostStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		id, err := strconv.ParseInt(s.Param("id"), 10, 64)
		if err != nil || id < 0 {
			util.Error("StudentGroupRequest", err.Error())
			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, "Oh dear there was some error thing!")
			return
		}

		body, err := api.DeleteStudentGroup(s, id)
		if err != nil {
			util.Error("DeleteStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func GetStudentGroupsRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		// what to filter the studentgroups by
		// for example, "category"
		filterBy := s.Query("filter")

		// used with sortBy this is what
		// the field should match _identially_
		// for example, sortBy category and match class
		// will make sure that value of category === "class"
		match := s.Query("match")

		body, err := api.GetStudentGroups(s)
		if err != nil {
			util.Error("GetStudentGroupsRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		if filterBy == "" && match == "" {
			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, body)
			return
		}

		var groups []*entity.StudentGroup
		err = jsoniter.Unmarshal([]byte(body), &groups)
		if err != nil {
			util.Error(err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		filteredGroups := sortStudentGroups(groups, filterBy, match)
		data, err := jsoniter.Marshal(&filteredGroups)
		if err != nil {
			util.Error(err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(data))
	}
}

func GetStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.Atoi(s.Param("id"))
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.GetStudentGroup(s, groupID)
		if err != nil {
			util.Error("GetStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func PutStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupID, err := strconv.Atoi(s.Param("id"))
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.PutStudentGroup(s, groupID)
		if err != nil {
			util.Error("PutStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
