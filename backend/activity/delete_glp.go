package activity

type DeletedGLPActivity struct {
	SimpleActivity
}

func NewDeleteGLPActivity(apiReq []byte) *DeletedGLPActivity {
	return &DeletedGLPActivity{
		newSimpleActivity("Deleted GLP"),
	}
}
