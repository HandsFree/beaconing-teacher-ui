package activity

import "log"

func Parse(kind ActivityType, apiReq []byte) Activity {
	var result Activity
	switch kind {
	case CreateStudentGroupActivity:
		result = NewCreateStudentGroupActivity(apiReq)
	case DeleteStudentGroupActivity:
		result = NewDeleteStudentGroupActivity(apiReq)
	case GroupAssignGLPActivity:
		result = NewGroupAssignGLPActivity(apiReq)
	case GroupUnassignGLPActivity:
		result = NewGroupUnassignGLPActivity(apiReq)

	case CreateStudentActivity:
		result = NewCreateStudentActivity(apiReq)
	case DeleteStudentActivity:
		result = NewDeleteStudentActivity(apiReq)

	case DeleteGLPActivity:
		result = NewDeleteGLPActivity(apiReq)
	case PutGLPActivity:
		result = NewPutGLPActivity(apiReq)
	case CreateGLPActivity:
		result = NewCreateGLPActivity(apiReq)
	case StudentAssignGLPActivity:
		result = NewAssignedGLPActivity(apiReq)
	case StudentUnassignGLPActivity:
		result = NewUnassignedGLPActivity(apiReq)
	default:
		log.Println("-- Unhandled activity type, tell the dashboard devs to get it together!", kind)
	}
	return result
}
