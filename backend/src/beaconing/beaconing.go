package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.BestSpeed))

	router.LoadHTMLFiles("frontend/public/index.html")
	router.Static("/dist", "./frontend/public/dist")

	router.GET("/", handleRoot)
	router.GET("/lesson_manager", handleLessonManager)
	router.GET("/intent/token", handleToken)
	router.GET("/intent/students", handleStudents)
	router.GET("/intent/student/:id/*action", handleStudent)
	router.GET("/intent/assign/:student/to/:glp", handleAssign)
	router.GET("/intent/glps", handleGLPs)
	router.GET("/intent/glp/:id", handleGLP)

	err := router.Run(":8081")
	if err != nil {
		log.Fatal(err)
	}
}
