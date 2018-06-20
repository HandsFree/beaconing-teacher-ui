package activities

import "time"

// ActivityType is a type of activity
// that can be performed, for example
// an assignment. These activities
// are displayed on the dashboard as
// "recent activities".
type ActivityType int

const (
	CreateStudentGroupActivity ActivityType = iota
	DeleteStudentGroupActivity

	GroupAssignGLPActivity
	GroupUnassignGLPActivity

	CreateStudentActivity
	DeleteStudentActivity

	DeleteGLPActivity
	CreateGLPActivity
	PutGLPActivity

	StudentAssignGLPActivity
	StudentUnassignGLPActivity
	// TODO: EditGLPActivity

	// TODO: changes a setting
	// TODO: edits a student
	// TODO: edits a group
)

type Activity interface {
	GetMessage() string
	SetMessage(s string)

	// when the activity was executed
	GetExecutionTime() time.Time
	SetExecutionTime(t time.Time)
}

type SimpleActivity struct {
	Message       string
	ExecutionTime time.Time
}

func newSimpleActivity(msg string) SimpleActivity {
	return SimpleActivity{msg, time.Now()}
}

func (s SimpleActivity) SetExecutionTime(t time.Time) {
	s.ExecutionTime = t
}

func (s SimpleActivity) GetExecutionTime() time.Time {
	return s.ExecutionTime
}

func (s SimpleActivity) GetMessage() string {
	return s.Message
}

func (s SimpleActivity) SetMessage(msg string) {
	s.Message = msg
}
