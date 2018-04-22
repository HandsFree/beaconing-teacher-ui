package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/img"
	"git.juddus.com/HFC/beaconing/backend/serv"
)

func main() {
	cfg.LoadConfig()
	api.SetupAPIHelper()

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Beaconing.Server.Port),
		Handler: serv.GetRouterEngine(),
	}

	fmt.Println("Starting server on addr ", server.Addr)

	imageUploadServer := &http.Server{
		Addr:    ":5000",
		Handler: img.ImageUploadServerHandle(),
	}

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		log.Println("receive interrupt signal")

		if err := server.Close(); err != nil {
			log.Fatal("Server Close:", err)
		}

		if err := imageUploadServer.Close(); err != nil {
			log.Fatal("Image server close:", err)
		}
	}()

	// todo we can sep. this from the main
	// server if we need to?
	go func() {
		log.Println("Running image upload server at ", imageUploadServer.Addr)

		err := imageUploadServer.ListenAndServe()
		if err != nil {
			if err == http.ErrServerClosed {
				log.Println("Server closed under request")
			} else {
				log.Fatal("Server closed unexpectedly")
			}
		}
	}()

	if err := server.ListenAndServe(); err != nil {
		if err == http.ErrServerClosed {
			log.Println("Server closed under request")
		} else {
			log.Fatal("Server closed unexpectedly", err.Error())
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	if err := imageUploadServer.Shutdown(ctx); err != nil {
		log.Fatal("Image upload server shutdown:", err)
	}

	log.Println("Server exiting")
}
