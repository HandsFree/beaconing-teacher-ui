package req

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func sortStudentGroups(groups []*types.StudentGroup, filterBy string, match string) []*types.StudentGroup {
	// we are over allocating here but
	// it doesnt hurt anyone

	switch filterBy {
	case "category":
		result := []*types.StudentGroup{}
		for _, grp := range groups {
			if strings.Compare(grp.Category, match) == 0 {
				result = append(result, grp)
			}
		}
		return result
	default:
		log.Println("Attempted to sort student groups by", filterBy, "=>", match)
		// NOP
		return groups
	}
}

func PostStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		body, err := api.CreateStudentGroup(s)
		if err != nil {
			log.Println("PostStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func DeleteStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idString := s.Param("id")
		id, err := strconv.ParseInt(idString, 10, 64)
		if err != nil || id < 0 {
			log.Println("StudentGroupRequest", err.Error())
			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, "Oh dear there was some error thing!")
			return
		}

		body, err := api.DeleteStudentGroup(s, id)
		if err != nil {
			log.Println("DeleteStudentGroupRequest", err.Error())
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
			log.Println("GetStudentGroupsRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		if filterBy == "" && match == "" {
			s.Header("Content-Type", "application/json")
			s.String(http.StatusOK, body)
			return
		}

		var groups []*types.StudentGroup
		err = jsoniter.Unmarshal([]byte(body), &groups)
		if err != nil {
			log.Println(err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		filteredGroups := sortStudentGroups(groups, filterBy, match)
		data, err := jsoniter.Marshal(&filteredGroups)
		if err != nil {
			log.Println(err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(data))
	}
}

func GetStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.GetStudentGroup(s, groupID)
		if err != nil {
			log.Println("GetStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}

func PutStudentGroupRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		groupIDParam := s.Param("id")
		groupID, err := strconv.Atoi(groupIDParam)
		if err != nil {
			s.String(http.StatusBadRequest, "Group ID Error!")
			return
		}

		body, err := api.PutStudentGroup(s, groupID)
		if err != nil {
			log.Println("PutStudentGroupRequest", err.Error())
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, body)
	}
}
