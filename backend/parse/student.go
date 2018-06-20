package parse

import (
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func Students(s *gin.Context) ([]*types.Student, error) {
	studentsData, err := api.GetStudents(s)
	if err != nil {
		log.Println("parse.Students", err.Error())
		return []*types.Student{}, err
	}

	// conv json -> objects
	var students []*types.Student
	if err := jsoniter.Unmarshal([]byte(studentsData), &students); err != nil {
		log.Println("parse.Students", err)
		return nil, err
	}

	return students, nil
}
