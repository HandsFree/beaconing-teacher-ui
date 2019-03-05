package parse

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func Student(s *gin.Context, id uint64) (entity.Student, error) {
	cache := api.BigCacheInstance()

	doCache := func(cache *api.CacheWrapper) []byte {
		data, err := api.GetStudent(s, id)
		if err != nil {
			util.Error("parse.Student", err.Error())
			return []byte{}
		}

		payload := []byte(data)
		cache.Set("parse_student", payload)
		return payload
	}

	resp, err := cache.Get("parse_student")
	if err != nil {
		resp = doCache(cache)
	}

	// conv json -> objects
	var student entity.Student
	if err := jsoniter.Unmarshal([]byte(resp), &student); err != nil {
		// the data in the cache might be bad in which
		// case we should re-cache the data so that
		// we dont repeat this error every request.
		doCache(cache)

		util.Error("parse.Student", err)
		return entity.Student{}, err
	}

	return student, nil
}

func Students(s *gin.Context) ([]*entity.Student, error) {
	cache := api.BigCacheInstance()

	doCache := func(cache *api.CacheWrapper) []byte {
		data, err := api.GetStudents(s)
		if err != nil {
			util.Error("parse.Students", err.Error())
			return []byte{}
		}

		payload := []byte(data)
		cache.Set("parse_students", payload)
		return payload
	}

	resp, err := cache.Get("parse_students")
	if err != nil {
		resp = doCache(cache)
	}

	// conv json -> objects
	var students []*entity.Student
	if err := jsoniter.Unmarshal([]byte(resp), &students); err != nil {
		// the data in the cache might be bad in which
		// case we should re-cache the data so that
		// we dont repeat this error every request.
		doCache(cache)

		util.Error("parse.Students", err)
		return nil, err
	}

	return students, nil
}
