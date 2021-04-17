package controllers

import (
	"net/http"
)

// update the card , requires auth
func update(w http.ResponseWriter, r *http.Request) {
	// maybe not needed think later
}

/*
everything is done in terms of DTO
and we need to map it to the DAO and vice versa before sending too
*/
