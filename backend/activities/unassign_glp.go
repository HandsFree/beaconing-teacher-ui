package activities

type UnassignedGLPActivity struct {
	SimpleActivity
}

func NewUnassignedGLPActivity(apiReq []byte) *UnassignedGLPActivity {
	return &UnassignedGLPActivity{
		newSimpleActivity("Un-assigned a GLP"),
	}
}
