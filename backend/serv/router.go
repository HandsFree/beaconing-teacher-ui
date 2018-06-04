package serv

import (
	"crypto/rand"
	"fmt"
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/authoring_tool"
	"git.juddus.com/HFC/beaconing/backend/calendar"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/classroom"
	"git.juddus.com/HFC/beaconing/backend/glpviewer"
	"git.juddus.com/HFC/beaconing/backend/lesson_manager"
	"git.juddus.com/HFC/beaconing/backend/page"
	"git.juddus.com/HFC/beaconing/backend/profile"
	"git.juddus.com/HFC/beaconing/backend/req"
	"git.juddus.com/HFC/beaconing/backend/root"
	"git.juddus.com/HFC/beaconing/backend/search"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/thinkerou/favicon"
)

// TokenAuth ...
// simple middleware to handle token auth
func TokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Request.FormValue("code")

		session := sessions.Default(c)
		accessToken := session.Get("access_token")

		if code == "" && accessToken == nil {
			// we have no code and no access
			// token so lets ask for auth
			authLink := fmt.Sprintf("https://core.beaconing.eu/auth/auth?response_type=code%s%s%s%s",
				"&client_id=", cfg.Beaconing.Auth.ID,
				"&redirect_uri=", api.GetRedirectBaseLink())
			c.Redirect(http.StatusTemporaryRedirect, authLink)
			return
		}

		c.Next()
	}
}

// CreateSessionSecret returns a random byte array
func createSessionSecret(size int) []byte {
	sessionKey := make([]byte, size)

	_, err := rand.Read(sessionKey)
	if err != nil {
		panic(err)
	}

	return sessionKey
}

func GetRouterEngine() *gin.Engine {
	// Create the main router
	router := gin.Default()

	// Create the cookie store
	store := cookie.NewStore(createSessionSecret(32), createSessionSecret(16))

	// Config the router to use sessions with cookie store
	router.Use(sessions.Sessions("beaconing", store))

	// Resources will be gzipped
	router.Use(gzip.Gzip(gzip.BestSpeed))

	// Add favicon
	router.Use(favicon.New("../frontend/public/favicon.ico"))

	// token auth middleware
	router.Use(TokenAuth())

	router.NoRoute(func(c *gin.Context) {
		c.String(404, "Error: 404 Page Not Found!")
	})

	// Load the main template file
	router.LoadHTMLFiles("./../frontend/public/index.html")

	// Serve all static files
	router.Static("/dist", "./../frontend/public/dist")

	// Redirect trailing slashes
	router.RedirectTrailingSlash = true

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

	// ---
	// GIN WRAPPERS: Widgets
	// ---

	widgets := router.Group("/widget/")
	{
		widgets.GET("student_overview", req.GetStudentOverview())

		widgets.GET("recent_activities", req.GetRecentActivities())

		widgets.GET("active_lesson_plans", req.GetActiveLessonPlansWidget())
	}

	// ---
	// GIN WRAPPERS: API
	// ---

	v1 := router.Group("/api/v1/")

	authAPI := v1.Group("auth")
	{
		authAPI.GET("gettoken", req.GetCheckAuthRequest())
	}

	tokens := v1.Group("token")
	{
		tokens.GET("/", req.GetTokenRequest())
	}

	assign := v1.Group("assign")
	{
		assign.GET("/:student/to/:glp", req.GetAssignRequest())
	}

	assignGroup := v1.Group("assigngroup")
	{
		assignGroup.GET("/:group/to/:glp", req.GetGroupAssignRequest())
	}

	student := v1.Group("student")
	{
		student.GET("/:id", req.GetStudentRequest())
		student.PUT("/:id", req.PutStudentRequest())
		student.DELETE("/:id", req.DeleteStudentRequest())
		student.POST("/", req.PostStudentRequest())

		student.GET("/:id/assignedglps", req.GetAssignedGLPsRequest())
		student.DELETE("/:id/assignedglps/:glp", req.DeleteAssignedGLPsRequest())
	}

	students := v1.Group("students")
	{
		students.GET("/", req.GetStudentsRequest())
		students.GET("/:id/assignedglps", req.GetAssignedGLPsRequest())
		students.DELETE("/:id/assignedglps/:glp", req.DeleteAssignedGLPsRequest())

		// TODO!
		// PUT
		// POST id/assigned glps
		// students.POST("/", req.PostStudentsRequest())
	}

	profile := v1.Group("profile")
	{
		profile.GET("/", req.GetProfileRequest())
		profile.PUT("/", req.PutProfileRequest())
	}

	glps := v1.Group("glps")
	{
		glps.GET("/", req.GetGLPSRequest())
	}

	glp := v1.Group("glp")
	{
		glp.GET("/:id", req.GetGLPRequest())
		glp.DELETE("/:id", req.DeleteGLPRequest())
		glp.POST("/", req.PostGLPRequest())
	}

	studentGroups := v1.Group("studentgroups")
	{
		studentGroups.GET("/", req.GetStudentGroupsRequest())
	}

	studentGroup := v1.Group("studentgroup")
	{
		studentGroup.GET("/:id", req.GetStudentGroupRequest())
		studentGroup.PUT("/:id", req.PutStudentGroupRequest())
		studentGroup.GET("/:id/assignedglps", req.GetStudentGroupAssignedRequest())
		studentGroup.DELETE("/:id/assignedglps/:glp", req.DeleteGroupAssignedRequest())
		studentGroup.POST("/", req.PostStudentGroupRequest())
		studentGroup.DELETE("/:id", req.DeleteStudentGroupRequest())
	}

	v1.POST("search", req.PostSearchRequest())

	return router
}
