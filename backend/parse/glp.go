package parse

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func AssignedGLPS(s *gin.Context, id uint64) ([]*entity.GLP, error) {
	resp := api.GetAssignedGLPS(s, id, false)
	var plans []*entity.GLP
	if err := jsoniter.Unmarshal([]byte(resp), &plans); err != nil {
		util.Error(err.Error())
		return []*entity.GLP{}, err
	}
	return plans, nil
}

// GLPS will perform an api request to load
// all of the glps and then parse the request into a
// list of entity.GLP's
func GLPS(s *gin.Context, shouldMinify bool) ([]*entity.GLP, error) {

	resp, err := api.GetGLPS(s, shouldMinify)
	if err != nil {
		util.Error("loadPlans", err.Error())
		return nil, err
	}

	var plans []*entity.GLP

	if err := jsoniter.Unmarshal([]byte(resp), &plans); err != nil {
		util.Error(err.Error())
		return []*entity.GLP{}, err
	}

	return plans, nil
}
