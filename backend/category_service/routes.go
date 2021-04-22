package category_service

import (
	"calipv2/category_service/controllers"
	"calipv2/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func NewCategorySvcRouter(r *mux.Router) *mux.Router {
	return load(r)
}

func load(r *mux.Router) *mux.Router {
	r.HandleFunc("/category", f(controllers.Get)).Methods(http.MethodGet)
	return r
}

func f(fn http.HandlerFunc) http.HandlerFunc {
	return middlewares.SetContentJSON(middlewares.SetLogger(fn))
}
