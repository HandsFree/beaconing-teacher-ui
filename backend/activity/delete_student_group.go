package activity

type DeletedStudentGroupActivity struct {
	SimpleActivity
}

func NewDeleteStudentGroupActivity(apiReq []byte) *DeletedStudentGroupActivity {
	return &DeletedStudentGroupActivity{
		newSimpleActivity("Deleted student group"),
	}
}

func (a DeletedStudentGroupActivity) GetName() string {
	return "Delete Student Group"
}
