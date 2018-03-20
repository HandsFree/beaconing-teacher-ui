package activities

import (
	"log"

	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/json-iterator/go"
)

type CreatedStudentGroupActivity struct {
	SimpleActivity
	GroupName string
}

func NewCreateStudentGroupActivity(apiReq []byte) *CreatedStudentGroupActivity {
	groupName := "Undefined Group Name!" // just in case this happens!

	data := &types.StudentGroup{}
	if err := jsoniter.Unmarshal(apiReq, data); err != nil {
		log.Println("NewCreateStudentGroupActivity", err.Error())
	}

	if data != nil {
		groupName = data.Name
	}

	return &CreatedStudentGroupActivity{
		newSimpleActivity("Created student group"),
		groupName,
	}
}
