package serv

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/page"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/authoring_tool"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/calendar"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/classroom"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/glpviewer"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/lesson_manager"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/profile"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/root"
	"github.com/HandsFree/beaconing-teacher-ui/backend/page/search"
	"github.com/HandsFree/beaconing-teacher-ui/backend/req"
	"github.com/gin-gonic/gin"
)

func registerPages(router *gin.Engine) {
	// ---
	// GIN WRAPPERS: Pages
	// ---

	router.GET("/", root.Get(page.New("Home", "dist/beaconing/pages/home/page.js")))

	classroomGroup := router.Group("/classroom")
	{
		classroomGroup.GET("/", classroom.Get(page.New("Classroom", "dist/beaconing/pages/classroom/page.js")))
		classroomGroup.GET("/groups", classroom.GetGroups(page.New("Classroom", "dist/beaconing/pages/classroom/groups/page.js")))
		classroomGroup.GET("/student", classroom.GetStudent(page.New("Classroom", "dist/beaconing/pages/classroom/student/page.js")))
		classroomGroup.GET("/group", classroom.GetGroup(page.New("Classroom", "dist/beaconing/pages/classroom/group/page.js")))
	}

	router.GET("/authoring_tool", authoring_tool.Get(page.New("Authoring Tool", "dist/beaconing/pages/authoring_tool/page.js")))

	lessonManager := router.Group("/lesson_manager")
	{
		lessonManager.GET("/", lesson_manager.Get(page.New("Lesson Manager", "dist/beaconing/pages/lesson_manager/page.js")))
	}

	router.GET("/calendar", calendar.Get(page.New("Calendar", "dist/beaconing/pages/calendar/page.js")))
	router.GET("/search", search.Get(page.New("Search", "dist/beaconing/pages/search/page.js")))
	router.GET("/profile", profile.Get(page.New("Profile", "dist/beaconing/pages/profile/page.js")))

	authPage := router.Group("auth")
	{
		authPage.GET("logout", req.GetLogOutRequest())
	}

	if gin.IsDebugging() {
		router.GET("/glpviewer", glpviewer.Get(page.New("GLP Viewer", "dist/beaconing/pages/glpviewer/page.js")))
	}
}
