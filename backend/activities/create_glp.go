package activities

type CreatedGLPActivity struct {
	SimpleActivity
}

func NewCreateGLPActivity(apiReq []byte) *CreatedGLPActivity {
	return &CreatedGLPActivity{
		newSimpleActivity("Created a GLP"),
	}
}
