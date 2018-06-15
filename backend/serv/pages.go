package serv

import (
	"git.juddus.com/HFC/beaconing/backend/authoring_tool"
	"git.juddus.com/HFC/beaconing/backend/calendar"
	"git.juddus.com/HFC/beaconing/backend/classroom"
	"git.juddus.com/HFC/beaconing/backend/glpviewer"
	"git.juddus.com/HFC/beaconing/backend/lesson_manager"
	"git.juddus.com/HFC/beaconing/backend/page"
	"git.juddus.com/HFC/beaconing/backend/profile"
	"git.juddus.com/HFC/beaconing/backend/req"
	"git.juddus.com/HFC/beaconing/backend/root"
	"git.juddus.com/HFC/beaconing/backend/search"
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
