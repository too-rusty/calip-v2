package router

import (
	"calipv2/bookmark_service"
	"calipv2/category_service"
	"calipv2/cc_service"
	"calipv2/search_service"
	"calipv2/user_service"

	"github.com/gorilla/mux"
)

func New() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)
	r = user_service.NewUserSvcRouter(r)
	r = cc_service.NewCcSvcRouter(r)
	r = bookmark_service.NewBmSvcRouter(r)
	r = search_service.NewSearchSvcRouter(r)
	r = category_service.NewCategorySvcRouter(r)
	return r
}
