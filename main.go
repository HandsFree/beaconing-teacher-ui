package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"

	"git.juddus.com/HFC/beaconing.git/route"
	"git.juddus.com/HFC/beaconing.git/req"
	"git.juddus.com/HFC/beaconing.git/page"
	"git.juddus.com/HFC/beaconing.git/serv"
)

/*
var ROUTES_OLD = map[string]gin.HandlerFunc{
	"/":                               handleRoot,
	"/lesson_manager":                 handleLessonManager,
	
	"/intent/token":                   handleToken,
	"/intent/students":                handleStudents,
	"/intent/student/:id/*action":     handleStudent,
	"/intent/assign/:student/to/:glp": handleAssign,
	"/intent/glps":                    handleGLPs,
	"/intent/glp/:id":                 handleGLP,
}
*/

var server *serv.BeaconingServer

func main() {
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.BestSpeed))

	router.LoadHTMLFiles("frontend/public/index.html")
	router.Static("/dist", "./frontend/public/dist")

	server = serv.NewBeaconingInst(router)

	manager := route.NewRouteManager(server)
	manager.RegisterRoutes(
		page.NewPage("/", "Home", "dist/beaconing/pages/home/index.js"),
		page.NewPage("/lesson_manager", "Lesson Manager", "dist/beaconing/pages/lesson_manager/index.js"),

		// for now just so it works til i 
		// design this properly?
		req.NewRequest("/intent/token"))
	
	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
