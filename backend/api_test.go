package main_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"github.com/gin-gonic/gin"
)

// TODO!

func TestGetStudents(t *testing.T) {
	makeServer()
}

func makeServer() *gin.Engine {
	cfg.LoadConfig()
	api.SetupAPIHelper()

	router := serv.GetRouterEngine()
	serv := http.Server{
		Addr: ":6060",
		Handler: router,
	}
	httptest.NewServer(serv.Handler)
	return router
}
