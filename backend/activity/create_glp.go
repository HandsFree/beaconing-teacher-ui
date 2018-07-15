package activity

type CreatedGLPActivity struct {
	SimpleActivity
}

func NewCreateGLPActivity(apiReq []byte) *CreatedGLPActivity {
	return &CreatedGLPActivity{
		newSimpleActivity("Created a GLP"),
	}
}

func (c CreatedGLPActivity) GetName() string {
	return "GLP Creation"
}
