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

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/auth"
	"git.juddus.com/HFC/beaconing/cfg"
	"git.juddus.com/HFC/beaconing/page"
	"git.juddus.com/HFC/beaconing/paths"
	"git.juddus.com/HFC/beaconing/req"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
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
				serv.AuthRedirect(c)
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
	router.LoadHTMLFiles("frontend/public/index.html")

	// Serve all static files
	router.Static("/dist", "./frontend/public/dist")

	// Redirect trailing slashes
	router.RedirectTrailingSlash = true

	// Create Gin wrappers
	mainCtx := serv.NewSessionContext(router)
	manager := route.NewRouteManager(mainCtx)

	// Route configs
	pages := []route.Route{
		page.NewPage("/", "Home", "dist/beaconing/pages/home/page.js"),

		page.NewPage("/lesson_manager", "Lesson Manager", "dist/beaconing/pages/lesson_manager/page.js"),
		page.NewPage("/lesson_manager/new_plan", "Lesson Manager", "dist/beaconing/pages/lesson_manager/new_plan/page.js"),

		page.NewPage("/authoring_tool", "Authoring Tool", "dist/beaconing/pages/authoring_tool/page.js"),

		page.NewPage("/classroom", "Classroom", "dist/beaconing/pages/classroom/page.js"),

		// see issue #61
		page.NewPage("/classroom/", "Classroom", "dist/beaconing/pages/classroom/page.js"),
		//.                   ^^^^

		page.NewPage("/classroom/classes", "Classroom", "dist/beaconing/pages/classroom/classes/page.js"),
		page.NewPage("/classroom/groups", "Classroom", "dist/beaconing/pages/classroom/groups/page.js"),
		page.NewPage("/classroom/courses", "Classroom", "dist/beaconing/pages/classroom/courses/page.js"),

		page.NewPage("/search", "Search", "dist/beaconing/pages/search/page.js"),
	}

	widgets := []route.Route{
		req.NewStudentOverview("/widget/student_overview"),
		req.NewRecentActivities("/widget/recent_activities"),
		req.NewActiveLessonPlansWidget("/widget/active_lesson_plans"),
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

	// Enable the routes
	manager.RegisterRoutes(pages...)
	manager.RegisterRoutes(widgets...)
	manager.RegisterRoutes(api...)
	manager.RegisterRoutes(auth...)

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
