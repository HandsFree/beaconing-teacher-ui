package parse

import (
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func Students(s *gin.Context) ([]*entity.Student, error) {
	studentsData, err := api.GetStudents(s)
	if err != nil {
		log.Println("parse.Students", err.Error())
		return []*entity.Student{}, err
	}

	// conv json -> objects
	var students []*entity.Student
	if err := jsoniter.Unmarshal([]byte(studentsData), &students); err != nil {
		log.Println("parse.Students", err)
		return nil, err
	}

	return students, nil
}
