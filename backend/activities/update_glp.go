package activities

type UpdatedGLPActivity struct {
	SimpleActivity
}

func NewPutGLPActivity(apiReq []byte) *UpdatedGLPActivity {
	return &UpdatedGLPActivity{
		newSimpleActivity("Updated GLP"),
	}
}
