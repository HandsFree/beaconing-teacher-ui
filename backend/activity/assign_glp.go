package activity

type AssignedGLPActivity struct {
	SimpleActivity
}

func NewAssignedGLPActivity(apiReq []byte) *AssignedGLPActivity {
	return &AssignedGLPActivity{
		newSimpleActivity("Assigned a GLP"),
	}
}

func (a AssignedGLPActivity) GetName() string {
	return "GLP Assignment"
}
