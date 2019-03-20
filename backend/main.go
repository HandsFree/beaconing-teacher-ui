package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	grmon "github.com/bcicen/grmon/agent"
	raven "github.com/getsentry/raven-go"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/serv"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
)

func main() {
	cfg.LoadConfig()
	if cfg.Beaconing.Debug.Grmon {
		grmon.Start()
		util.Log(util.VerboseLog, "grmon started")
	}

	raven.SetDSN("https://a6fa84dc8a194ac899cfee18910f6813:14dc8b458fac43acbaab54d8ac02ab1b@sentry.io/1292950")

	api.SetupAPIHelper()

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Beaconing.Server.Port),
		Handler: serv.GetRouterEngine(),
	}

	fmt.Println("Starting server on addr ", server.Addr)

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		util.Verbose("receive interrupt signal")

		if err := server.Close(); err != nil {
			util.Error("Server Close:", err)
		}
	}()

	if err := server.ListenAndServe(); err != nil {
		if err == http.ErrServerClosed {
			util.Verbose("Server closed under request")
		} else {
			util.Fatal("Server closed unexpectedly", err.Error())
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}

	util.Verbose("Server exiting")
}
