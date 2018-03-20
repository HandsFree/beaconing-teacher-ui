package activities

type CreatedStudentActivity struct {
	SimpleActivity
}

func NewCreateStudentActivity(apiReq []byte) *CreatedStudentActivity {
	return &CreatedStudentActivity{
		newSimpleActivity("Created a student"),
	}
}
