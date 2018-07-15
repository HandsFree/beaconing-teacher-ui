package activity

type GroupUnassignedGLPActivity struct {
	SimpleActivity
}

func NewGroupUnassignGLPActivity(apiReq []byte) *GroupUnassignedGLPActivity {
	return &GroupUnassignedGLPActivity{
		newSimpleActivity("Unassigned group GLP"),
	}
}

func (a GroupUnassignedGLPActivity) GetName() string {
	return "Group Unassign"
}

type GroupAssignedGLPActivity struct {
	SimpleActivity
}

func NewGroupAssignGLPActivity(apiReq []byte) *GroupAssignedGLPActivity {
	return &GroupAssignedGLPActivity{
		newSimpleActivity("Assigned group GLP"),
	}
}

func (a GroupAssignedGLPActivity) GetName() string {
	return "Group Assign"
}
