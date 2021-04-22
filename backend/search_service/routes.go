package search_service

import (
	"calipv2/middlewares"
	"calipv2/search_service/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func NewSearchSvcRouter(r *mux.Router) *mux.Router {
	return load(r)
}

func load(r *mux.Router) *mux.Router {

	//ALSO PAGE_NO QUERY PARAM
	//ALSO LIKE QUERY PARAM
	//ALSO DATE QUERY PARAM
	r.HandleFunc("/search/user/{uname}", f(controllers.SearchByUname)).Methods(http.MethodGet)
	r.HandleFunc("/search/tag/{tag}", f(controllers.SearchByTagname)).Methods(http.MethodGet)
	//ALSO SEND OUT THE RECOMMENDED TAGS TOO can be done easily on frontend

	r.HandleFunc("/search", f(controllers.Search)).Methods(http.MethodGet)

	// r.HandleFunc("/category", f(controllers.SearchByTagname)).Methods(http.MethodGet) // LIST ALL CATEG
	//all popular hardcoded categories which are hand picked tafs only

	// POPULAR CATEGORIES
	// VOTES
	return r
}

func f(fn http.HandlerFunc) http.HandlerFunc {
	return middlewares.SetContentJSON(middlewares.SetLogger(fn))
}

/*

ok simply put there will be a search bar , everywhere on all pages ,for uname or tag only

and all the cards will be displayed here along with user and tags, and people can explore the cards
or the users and the tags of those simply

do we need a different db for this , maybe mongo etc but later

*/
