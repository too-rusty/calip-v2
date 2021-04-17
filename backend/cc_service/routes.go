package cc_service

import (
	"net/http"

	"calipv2/cc_service/controllers"
	"calipv2/middlewares"

	"github.com/gorilla/mux"
)

func NewCcSvcRouter(r *mux.Router) *mux.Router {
	return load(r)
}

func load(r *mux.Router) *mux.Router {
	r.HandleFunc("/cc/create", f(controllers.CreateAndUpdate)).Methods(http.MethodPost)
	// r.HandleFunc("/cc/{ccid}", update).Methods(http.MethodPut)
	r.HandleFunc("/cc/{ccid}", f(controllers.Get)).Methods(http.MethodGet)

	// TO IMPLEMENT USING PAGINATION
	r.HandleFunc("/drafts/{ccid}", f(controllers.Get)).Methods(http.MethodGet)

	return r
}

func f(fn http.HandlerFunc) http.HandlerFunc {
	return middlewares.SetContentJSON(middlewares.SetLogger(fn))
}

/*
create on the frontend is simply create

get is for getting the card

create and update is for creating and updating the card
when user saves the card as draft then the card id is set and returned by calling create
the user remains on the same page but the id is set so call update from the frontend in that case

*/
