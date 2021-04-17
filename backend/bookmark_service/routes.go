package bookmark_service

import (
	"calipv2/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func NewBmSvcRouter(r *mux.Router) *mux.Router {
	return load(r)
}

func load(r *mux.Router) *mux.Router {
	r.HandleFunc("/bookmark/createORremove", f(createORremove)).Methods(http.MethodPost)
	r.HandleFunc("/bookmark", f(get)).Methods(http.MethodGet) // to implement
	return r
}

func f(h http.HandlerFunc) http.HandlerFunc {
	return middlewares.SetContentJSON(middlewares.SetLogger(h))
}
