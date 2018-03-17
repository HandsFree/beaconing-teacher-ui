package activities

import (
	"log"

	jsoniter "github.com/json-iterator/go"
	"git.juddus.com/HFC/beaconing/backend/types"
)

type Activity interface {
	GetMessage() string
	SetMessage(s string)
}

type SimpleActivity struct {
	Message string
}

func newSimpleActivity(msg string) SimpleActivity {
	return SimpleActivity{msg}
}

func (s SimpleActivity) GetMessage() string {
	return s.Message
}

func (s SimpleActivity) SetMessage(msg string) {
	s.Message = msg
}

type CreatedStudentGroupActivity struct {
	SimpleActivity
	GroupName string
}

// TODO do we have to store the ID of the group here?
// in the future yes because we can store a link i.e
// whatever.com/whatever/student_groups/{the_id_here}
// so when we click the group it will take us there!
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

