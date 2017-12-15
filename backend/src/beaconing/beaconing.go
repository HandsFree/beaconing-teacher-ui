package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

var ROUTES = map[string]gin.HandlerFunc{
	"/": handleRoot,
	"/lesson_manager": handleLessonManager,
	"/intent/token": handleToken,
	"/intent/students": handleStudents,
	"/intent/student/:id/*action": handleStudent,
	"/intent/assign/:student/to/:glp": handleAssign,
	"/intent/glps": handleGLPs,
	"/intent/glp/:id": handleGLP,
}

func main() {
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.BestSpeed))

	router.LoadHTMLFiles("frontend/public/index.html")
	router.Static("/dist", "./frontend/public/dist")
	for key, val := range ROUTES {
		router.GET(key, val)
	}

	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)		
	}
}
