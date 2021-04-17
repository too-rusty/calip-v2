package main

import (
	"calipv2/db"
	"calipv2/router"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/handlers"
)

func main() {
	run()
}
func run() {
	// config.Load()
	db.Load()
	fmt.Println("\n\tListening localhost:8000")
	listen(8000) // config.PORT
}

func listen(PORT int) {
	r := router.New()
	// CORS CORS CORS
	// headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	headersOk := handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "token", "sameSite"})
	cors := handlers.CORS(originsOk, methodsOk, headersOk)
	//
	srv := &http.Server{
		Addr: fmt.Sprintf("localhost:%d", PORT),
		// Good practice to set timeouts to avoid Slowloris attacks.
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      cors(r), // Pass our instance of gorilla/mux in.
	}
	// 	log.Println(srv.Addr)
	// Run our server in a goroutine so that it doesn't block.
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	// Block until we receive our signal.
	<-c
	var wait time.Duration = time.Second * 2
	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), wait)
	defer cancel()
	srv.Shutdown(ctx)
	log.Println("shutting down")
	os.Exit(0)
}
