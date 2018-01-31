package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing/auth"
	"git.juddus.com/HFC/beaconing/cfg"
	"git.juddus.com/HFC/beaconing/page"
	"git.juddus.com/HFC/beaconing/req"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

func main() {
	cfg.LoadConfig()

	// Create the main router
	router := gin.Default()

	// Create the cookie store
	store := sessions.NewCookieStore(auth.CreateSessionSecret(32), auth.CreateSessionSecret(16))

	// Config the router to use sessions with cookie store
	router.Use(sessions.Sessions("beaconing", store))

	// Resources will be gzipped
	router.Use(gzip.Gzip(gzip.BestSpeed))

	/**
	 * TODO:
	 * Figure out how to make this work with the current routing system
	 */

	router.NoRoute(func(c *gin.Context) {
		c.String(404, "Error: 404 Page Not Found!")
	})

	// Load the main template file
	router.LoadHTMLFiles("frontend/public/index.html")

	// Serve all static files
	router.Static("/dist", "./frontend/public/dist")

	// Create Gin wrappers
	mainCtx := serv.NewSessionContext(router)
	manager := route.NewRouteManager(mainCtx)

	// Route configs
	pages := []route.Route{
		page.NewPage("/", "Home", "dist/beaconing/pages/home/index.js"),
		page.NewPage("/lesson_manager", "Lesson Manager", "dist/beaconing/pages/lesson_manager/index.js"),
		page.NewPage("/lesson_manager/view_plan", "Lesson Manager", "dist/beaconing/pages/lesson_manager/view_plan.js"),
		page.NewPage("/authoring_tool", "Authoring Tool", "dist/beaconing/pages/authoring_tool/index.js"),
		page.NewPage("/classroom", "Classroom", "dist/beaconing/pages/classroom/index.js"),
	}

	widgets := []route.Route{
		req.NewStudentOverview("/widget/student_overview"),
		req.NewRecentActivities("/widget/recent_activities"),
		req.NewActiveLessonPlans("/widget/active_lesson_plans"),
	}

	api := []route.Route{
		req.NewTokenRequest("/intent/token"),
		req.NewStudentsRequest("/intent/students"),
		req.NewStudentRequest("/intent/student/:id/*action"),
		req.NewAssignRequest("/intent/assign/:student/to/:glp"),
		req.NewGLPSRequest("/intent/glps"),
		req.NewGLPRequest("/intent/glp/:id"),
	}

	auth := []route.Route{
		req.NewCheckAuthRequest("/auth/check"),
	}

	// Enable the routes
	manager.RegisterRoutes(pages...)
	manager.RegisterRoutes(widgets...)
	manager.RegisterRoutes(api...)
	manager.RegisterRoutes(auth...)

	// Start Gin
	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
