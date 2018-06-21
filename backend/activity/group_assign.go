package activity

type GroupUnassignedGLPActivity struct {
	SimpleActivity
}

func NewGroupUnassignGLPActivity(apiReq []byte) *GroupUnassignedGLPActivity {
	return &GroupUnassignedGLPActivity{
		newSimpleActivity("Unassigned group GLP"),
	}
}

type GroupAssignedGLPActivity struct {
	SimpleActivity
}

func NewGroupAssignGLPActivity(apiReq []byte) *GroupAssignedGLPActivity {
	return &GroupAssignedGLPActivity{
		newSimpleActivity("Assigned group GLP"),
	}
}
