package activity

type DeletedStudentActivity struct {
	SimpleActivity
}

func NewDeleteStudentActivity(apiReq []byte) *DeletedStudentActivity {
	return &DeletedStudentActivity{
		newSimpleActivity("Deleted student"),
	}
}

func (a DeletedStudentActivity) GetName() string {
	return "Delete Student"
}
