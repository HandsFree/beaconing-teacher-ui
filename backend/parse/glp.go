package parse

import (
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/types"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GLPS will perform an api request to load
// all of the glps and then parse the request into a
// list of types.GLP's
func GLPS(s *gin.Context, shouldMinify bool) ([]*types.GLP, error) {
	resp, err := api.GetGLPS(s, shouldMinify)
	if err != nil {
		log.Println("loadPlans", err.Error())
		return []*types.GLP{}, err
	}

	var plans []*types.GLP
	if err := jsoniter.Unmarshal([]byte(resp), &plans); err != nil {
		log.Println(err.Error())
		return []*types.GLP{}, err
	}

	return plans, nil
}
