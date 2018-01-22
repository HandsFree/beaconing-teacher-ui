package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing/auth"
	"git.juddus.com/HFC/beaconing/page"
	"git.juddus.com/HFC/beaconing/req"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

func main() {
	router := gin.Default()

	store := sessions.NewCookieStore(auth.CreateSessionSecret(64), auth.CreateSessionSecret(16))
	router.Use(sessions.Sessions("mysession", store))

	router.Use(gzip.Gzip(gzip.BestSpeed))

	router.NoRoute(func(c *gin.Context) {
		c.String(404, "Error: 404 Page Not Found!")
	})

	router.LoadHTMLFiles("frontend/public/index.html")
	router.Static("/dist", "./frontend/public/dist")

	mainCtx := serv.NewSessionContext(router)

	manager := route.NewRouteManager(mainCtx)
	routes := []route.Route{
		// simple pages
		page.NewPage("/", "Home", "dist/beaconing/pages/home/index.js"),
		page.NewPage("/lesson_manager", "Lesson Manager", "dist/beaconing/pages/lesson_manager/index.js"),
		page.NewPage("/authoring_tool", "Authoring Tool", "dist/beaconing/pages/authoring_tool/index.js"),
		// page.NewPage("/classroom", "Classroom", "dist/beaconing/pages/classroom/index.js"),

		// our api requests, these are
		// per component for a modular thing
		req.NewStudentOverview("/widget/student_overview"),
		req.NewRecentActivities("/widget/recent_activities"),
		req.NewActiveLessonPlans("/widget/active_lesson_plans"),

		// api wrapper requests
		req.NewTokenRequest("/intent/token"),
		req.NewStudentsRequest("/intent/students"),
		req.NewStudentRequest("/intent/student/:id/*action"),
		req.NewAssignRequest("/intent/assign/:student/to/:glp"),
		req.NewGLPSRequest("/intent/glps"),
		req.NewGLPRequest("/intent/glp/:id"),

		// auth requests
		req.NewCheckAuthRequest("/auth/check"),
	}

	manager.RegisterRoutes(routes...)

	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
