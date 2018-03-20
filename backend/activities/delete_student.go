package activities

type DeletedStudentActivity struct {
	SimpleActivity
}

func NewDeleteStudentActivity(apiReq []byte) *DeletedStudentActivity {
	return &DeletedStudentActivity{
		newSimpleActivity("Deleted student"),
	}
}
