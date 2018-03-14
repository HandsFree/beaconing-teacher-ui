package main

import (
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/auth"
	"git.juddus.com/HFC/beaconing/backend/authoring_tool"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/classroom"
	"git.juddus.com/HFC/beaconing/backend/lesson_manager"
	"git.juddus.com/HFC/beaconing/backend/page"
	"git.juddus.com/HFC/beaconing/backend/paths"
	"git.juddus.com/HFC/beaconing/backend/req"
	"git.juddus.com/HFC/beaconing/backend/root"
	"git.juddus.com/HFC/beaconing/backend/search"
	"git.juddus.com/HFC/beaconing/backend/serv"
)

// TokenAuth ...
// simple middleware to handle token auth
func TokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Request.FormValue("code")

		session := sessions.Default(c)
		accessToken := session.Get("access_token")

		if code == "" {
			if accessToken == nil {
				// we have no code and no access
				// token so lets ask for auth
				api.AuthRedirect(c)
				c.Abort()
				return
			}
		}

		c.Next()
	}
}

func GetRouterEngine() *gin.Engine {
	// Create the main router
	router := gin.Default()

	// Create the cookie store
	store := sessions.NewCookieStore(auth.CreateSessionSecret(32), auth.CreateSessionSecret(16))

	// Config the router to use sessions with cookie store
	router.Use(sessions.Sessions("beaconing", store))

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

	// Create Gin wrappers
	mainCtx := serv.NewSessionContext(router)
	manager := route.NewRouteManager(mainCtx)

	router.GET("/", root.Get(page.New("Home", "dist/beaconing/pages/home/page.js")))

	{
		router.GET("/classroom", classroom.Get(page.New("Classroom", "dist/beaconing/pages/classroom/page.js")))
		// see issue #61
		router.GET("/classroom/", classroom.Get(page.New("Classroom", "dist/beaconing/pages/classroom/page.js")))
		//.                   ^^^^

		router.GET("/classroom/classes", classroom.GetClasses(page.New("Classroom", "dist/beaconing/pages/classroom/classes/page.js")))
		router.GET("/classroom/groups", classroom.GetGroups(page.New("Classroom", "dist/beaconing/pages/classroom/groups/page.js")))
		router.GET("/classroom/courses", classroom.GetCourses(page.New("Classroom", "dist/beaconing/pages/classroom/courses/page.js")))
	}

	router.GET("/authoring_tool", authoring_tool.Get(page.New("Authoring Tool", "dist/beaconing/pages/authoring_tool/page.js")))

	// TODO use a group here.
	router.GET("/lesson_manager", lesson_manager.Get(page.New("Lesson Manager", "dist/beaconing/pages/lesson_manager/page.js")))
	router.GET("/lesson_manager/new_plan", lesson_manager.GetNewPlan(page.New("Lesson Manager", "dist/beaconing/pages/lesson_manager/new_plan/page.js")))

	router.GET("/search", search.Get(page.New("Search", "dist/beaconing/pages/search/page.js")))

	/*
		widgets := []route.Route{
			req.NewStudentOverview("/widget/student_overview"),
			req.NewRecentActivities("/widget/recent_activities"),
			req.NewActiveLessonPlansWidget("/widget/active_lesson_plans"),
		}
	*/

	v1 := router.Group("/api/v1/")

	tokens := v1.Group("token")
	{
		tokens.GET("/", req.GetTokenReq(page.NewPage("/", "/")))
	}

	api := []route.Route{
		// These are all GET requests
		req.NewTokenRequest("/intent/token"),
		req.NewAssignRequest("/intent/assign/:student/to/:glp"),
		req.NewStudentRequest("/intent/student/:id"),
		req.NewActiveLessonPlans("/intent/active_lesson_plans"),
		req.NewGLPSRequest("/intent/glps"),

		req.NewStudentsRequest(paths.PathSet{
			paths.Get("/intent/students"),
			paths.Post("/intent/students"),
		}),

		req.NewAssignedGLPsRequest(paths.PathSet{
			paths.Get("/intent/students/:id/assignedglps"),
			paths.Delete("/intent/students/:id/assignedglps/:glp"),
		}),

		// TODO PUT
		req.NewProfileRequest("/intent/profile"),

		req.NewGLPRequest(paths.PathSet{
			paths.Get("/intent/glp/:id"),
			paths.Delete("/intent/glp/:id"),
		}),

		req.NewStudentGroupRequest(paths.PathSet{
			paths.Get("/intent/studentgroups"),
			paths.Post("/intent/studentgroups"),
			paths.Delete("/intent/studentgroups/:id"),
		}),

		req.NewSearchRequest(paths.PathSet{
			paths.Post("/intent/search"),
		}),
	}

	auth := []route.Route{
		req.NewCheckAuthRequest("/auth/check"),
		req.NewLogOutRequest("/auth/logout"),
	}

	// manager.RegisterRoutes(pages...)
	// manager.RegisterRoutes(widgets...)
	manager.RegisterRoutes(api...)
	manager.RegisterRoutes(auth...)

	return router
}

func main() {
	cfg.LoadConfig()
	api.SetupAPIHelper()

	router := GetRouterEngine()
	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
