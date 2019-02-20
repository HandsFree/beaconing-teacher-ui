package activity

type CreatedStudentActivity struct {
	SimpleActivity
}

func NewCreateStudentActivity(apiReq []byte) *CreatedStudentActivity {
	return &CreatedStudentActivity{
		newSimpleActivity("Created a student"),
	}
}

func (a CreatedStudentActivity) GetName() string {
	return "Create Student"
}
