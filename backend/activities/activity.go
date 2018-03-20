package activities

// ActivityType is a type of activity
// that can be performed, for example
// an assignment. These activities
// are displayed on the dashboard as
// "recent activities".
type ActivityType int

const (
	CreateStudentGroupActivity ActivityType = iota
	DeleteStudentGroupActivity

	CreateStudentActivity
	DeleteStudentActivity

	DeleteGLPActivity
	CreateGLPActivity
	AssignGLPActivity
	// TODO: Unassign GLP activity
	// TODO: EditGLPActivity

	// TODO: changes a setting
	// TODO: edits a student
	// TODO: edits a group
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
