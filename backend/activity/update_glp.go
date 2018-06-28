package activity

type UpdatedGLPActivity struct {
	SimpleActivity
}

func NewPutGLPActivity(apiReq []byte) *UpdatedGLPActivity {
	return &UpdatedGLPActivity{
		newSimpleActivity("Updated GLP"),
	}
}

func (a UpdatedGLPActivity) GetName() string {
	return "Edit GLP"
}
