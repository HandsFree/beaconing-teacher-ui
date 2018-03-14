package types

import (
	"log"

	jsoniter "github.com/json-iterator/go"
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

type CreatedStudentActivity struct {
	SimpleActivity
	GroupName string
}

// TODO do we have to store the ID of the group here?
// in the future yes because we can store a link i.e
// whatever.com/whatever/student_groups/{the_id_here}
// so when we click the group it will take us there!
func NewCreateStudentActivity(apiReq []byte) *CreatedStudentActivity {
	groupName := "Undefined Group Name!" // just in case this happens!

	data := &StudentGroup{}
	if err := jsoniter.Unmarshal(apiReq, data); err != nil {
		log.Println("NewCreateStudentActivity", err.Error())
	}

	if data != nil {
		groupName = data.Name
	}

	return &CreatedStudentActivity{
		newSimpleActivity("Created student group"),
		groupName,
	}
}
