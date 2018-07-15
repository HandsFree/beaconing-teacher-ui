package activity

type UnassignedGLPActivity struct {
	SimpleActivity
}

func NewUnassignedGLPActivity(apiReq []byte) *UnassignedGLPActivity {
	return &UnassignedGLPActivity{
		newSimpleActivity("Unassigned a GLP"),
	}
}

func (a UnassignedGLPActivity) GetName() string {
	return "Unassign GLP"
}
