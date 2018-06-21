package activity

import (
	"log"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/json-iterator/go"
)

type CreatedStudentGroupActivity struct {
	SimpleActivity
	GroupName string
}

func NewCreateStudentGroupActivity(apiReq []byte) *CreatedStudentGroupActivity {
	groupName := "Undefined Group Name!" // just in case this happens!

	data := &entity.StudentGroup{}
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
