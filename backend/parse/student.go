package parse

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/allegro/bigcache"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func Students(s *gin.Context) ([]*entity.Student, error) {
	cache := api.BigCacheInstance()

	doCache := func(cache *bigcache.BigCache) []byte {
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
