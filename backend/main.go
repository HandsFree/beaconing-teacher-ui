package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/auth"
	"git.juddus.com/HFC/beaconing/backend/authoring_tool"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/classroom"
	"git.juddus.com/HFC/beaconing/backend/lesson_manager"
	"git.juddus.com/HFC/beaconing/backend/page"
	"git.juddus.com/HFC/beaconing/backend/req"
	"git.juddus.com/HFC/beaconing/backend/root"
	"git.juddus.com/HFC/beaconing/backend/search"
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

	// Resources will be gzipped
	router.Use(gzip.Gzip(gzip.BestSpeed))

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

	widgets := router.Group("/widget/")
	{
		widgets.GET("student_overview", req.GetStudentOverview())

		widgets.GET("recent_activities", req.GetRecentActivities())

		widgets.GET("active_lesson_plans", req.GetActiveLessonPlansWidget())
	}

	// TODO change this from intent to /api/v1/
	v1 := router.Group("/intent/")

	tokens := v1.Group("token")
	{
		tokens.GET("/", req.GetTokenRequest())
	}

	assign := v1.Group("assign")
	{
		assign.GET("/:student/to/:glp", req.GetAssignRequest())
	}

	student := v1.Group("student")
	{
		student.GET("/:id", req.GetStudentRequest())
	}

	students := v1.Group("students")
	{
		students.GET("/", req.GetStudentsRequest())

		students.GET("/:id/assignedglps", req.GetAssignedGLPsRequest())
		students.DELETE("/:id/assignedglps/:glp", req.DeleteAssignedGLPsRequest())

		// TODO!
		// students.POST("/", req.PostStudentsRequest())
	}

	// TODO PUT!
	v1.GET("profile", req.GetProfileRequest())

	v1.GET("active_lesson_plans", req.GetActiveLessonPlans())

	glps := v1.Group("glps")
	{
		glps.GET("/", req.GetGLPSRequest())
	}

	glp := v1.Group("glps")
	{
		glp.GET("/:id", req.GetGLPRequest())
		glp.DELETE("/:id", req.DeleteGLPRequest())
	}

	studentGroups := v1.Group("studentgroups")
	{
		studentGroups.GET("/", req.GetStudentGroupRequest())
		studentGroups.POST("/", req.PostStudentGroupRequest())
		studentGroups.DELETE("/", req.DeleteStudentGroupRequest())
	}

	v1.POST("search", req.PostSearchRequest())

	auth := router.Group("auth")
	{
		auth.GET("check", req.GetCheckAuthRequest())
		auth.GET("logout", req.GetLogOutRequest())
	}

	return router
}

func main() {
	cfg.LoadConfig()
	api.SetupAPIHelper()

	server := &http.Server{
		Addr:    ":8081",
		Handler: GetRouterEngine(),
	}

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		log.Println("receive interrupt signal")
		if err := server.Close(); err != nil {
			log.Fatal("Server Close:", err)
		}
	}()

	if err := server.ListenAndServe(); err != nil {
		if err == http.ErrServerClosed {
			log.Println("Server closed under request")
		} else {
			log.Fatal("Server closed unexpectedly")
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
