package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing.git/page"
	"git.juddus.com/HFC/beaconing.git/req"
	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/serv"
)

var server *serv.BeaconingServer

func main() {
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.BestSpeed))

	router.LoadHTMLFiles("frontend/public/index.html")
	router.Static("/dist", "./frontend/public/dist")

	server = serv.NewBeaconingInst(router)

	manager := route.NewRouteManager(server)
	routes := []route.Route{
		// simple pages
		page.NewPage("/", "Home", "dist/beaconing/pages/home/index.js"),
		page.NewPage("/lesson_manager", "Lesson Manager", "dist/beaconing/pages/lesson_manager/index.js"),

		// api requests
		req.NewTokenRequest("/intent/token"),
		req.NewStudentsRequest("/intent/students"),
		req.NewStudentRequest("/intent/student/:id/*action"),
		req.NewAssignRequest("/intent/assign/:student/to/:glp"),
		req.NewGLPSRequest("/intent/glps"),
		req.NewGLPRequest("/intent/glp/:id"),
	}
	manager.RegisterRoutes(routes...)

	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
