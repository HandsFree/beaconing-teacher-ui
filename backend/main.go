package main

import (
	"context"
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
		Addr:    ":8081",
		Handler: serv.GetRouterEngine(),
	}

	imageUploadServer := &http.Server{
		Addr:    ":5000",
		Handler: img.StartImageUploadServer(5000),
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

	go func() {
		if err := imageUploadServer.ListenAndServe(); err != nil {
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
			log.Fatal("Server closed unexpectedly")
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
