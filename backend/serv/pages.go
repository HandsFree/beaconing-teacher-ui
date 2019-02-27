package serv

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/page"
	"github.com/HandsFree/beaconing-teacher-ui/backend/req"
	"github.com/gin-gonic/gin"
)

func registerPages(router *gin.Engine) {
	// ---
	// GIN WRAPPERS: Pages
	// ---

	router.GET("/", page.GetRoot(page.New("Home", "dist/beaconing/pages/home/page.js")))

	classroomGroup := router.Group("/classroom")
	{
		classroomGroup.GET("/", page.GetClassroom(page.New("Classroom", "dist/beaconing/pages/classroom/page.js")))
		classroomGroup.GET("/groups", page.GetGroups(page.New("Classroom", "dist/beaconing/pages/classroom/groups/page.js")))
		classroomGroup.GET("/student", page.GetStudent(page.New("Classroom", "dist/beaconing/pages/classroom/student/page.js")))
		classroomGroup.GET("/group", page.GetGroup(page.New("Classroom", "dist/beaconing/pages/classroom/group/page.js")))
	}

	router.GET("/authoring_tool", page.GetAuthoringTool(page.New("Authoring Tool", "dist/beaconing/pages/authoring_tool/page.js")))

	lessonManager := router.Group("/lesson_manager")
	{
		lessonManager.GET("/", page.GetLessonManager(page.New("Lesson Manager", "dist/beaconing/pages/lesson_manager/page.js")))
	}

	router.GET("/calendar", page.GetCalendar(page.New("Calendar", "dist/beaconing/pages/calendar/page.js")))
	router.GET("/search", page.GetSearch(page.New("Search", "dist/beaconing/pages/search/page.js")))
	router.GET("/profile", page.GetProfile(page.New("Profile", "dist/beaconing/pages/profile/page.js")))

	authPage := router.Group("auth")
	{
		authPage.GET("logout", req.GetLogOutRequest())
	}

	if gin.IsDebugging() {
		router.GET("/glpviewer", page.GetGlpViewer(page.New("GLP Viewer", "dist/beaconing/pages/glpviewer/page.js")))
	}
}
