package user_service

import (
	"calipv2/middlewares"
	"calipv2/user_service/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func NewUserSvcRouter(r *mux.Router) *mux.Router {
	return load(r)
}

func load(r *mux.Router) *mux.Router {
	// login signup)
	r.HandleFunc("/login", mware(controllers.Login)).Methods(http.MethodPost)
	r.HandleFunc("/signup", mware(controllers.Signup)).Methods(http.MethodPost)

	// get profile info
	r.HandleFunc("/profile/{uname}", mware(controllers.GetProfile)).Methods(http.MethodGet)

	// edit profile
	r.HandleFunc("/profile", mware(controllers.EditProfile)).Methods(http.MethodPost)

	//TEST profile
	//silly was doing profile/test , it was thinking of it as a test user ???? whyyy
	r.HandleFunc("/prof/test", mware(controllers.TestProfile)).Methods(http.MethodGet)

	return r
}

func mware(fn http.HandlerFunc) http.HandlerFunc {
	return middlewares.SetLogger(middlewares.SetContentJSON(fn))
}
