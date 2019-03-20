package parse

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func Student(s *gin.Context, id uint64) (entity.Student, error) {
	resp, err := api.GetStudent(s, id)
	if err != nil {
		util.Error("parse.Student", err.Error())
		return entity.Student{}, err
	}

	// conv json -> objects
	var student entity.Student
	if err := jsoniter.Unmarshal([]byte(resp), &student); err != nil {
		util.Error("parse.Student", err)
		return entity.Student{}, err
	}

	return student, nil
}

func Students(s *gin.Context) ([]*entity.Student, error) {
	resp, err := api.GetStudents(s)
	if err != nil {
		util.Error("parse.Students", err.Error())
		return []*entity.Student{}, err
	}

	// conv json -> objects
	var students []*entity.Student
	if err := jsoniter.Unmarshal([]byte(resp), &students); err != nil {
		util.Error("parse.Students", err)
		return nil, err
	}

	return students, nil
}
