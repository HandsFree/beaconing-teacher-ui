package activities

type AssignedGLPActivity struct {
	SimpleActivity
}

func NewAssignedGLPActivity(apiReq []byte) *AssignedGLPActivity {
	return &AssignedGLPActivity{
		newSimpleActivity("Assigned a GLP"),
	}
}
