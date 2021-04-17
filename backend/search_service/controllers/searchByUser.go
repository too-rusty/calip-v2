package controllers

import (
	"calipv2/db"
	"calipv2/schema"
	"calipv2/search_service/dtos"
	"calipv2/token"
	"calipv2/utils/responses"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func SearchByUname(w http.ResponseWriter, r *http.Request) {

	// IF USER ALREADY LOGGED IN , then set login
	tokk := r.Header.Get("Token")
	var uname string
	if tokk != "" {
		maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return // do we need this
		}
		var payload *token.Payload = new(token.Payload)
		payload, err = maker.VerifyToken(tokk)
		if err == nil {
			uname = payload.Username
		}
	}

	username := mux.Vars(r)["uname"]

	database, err := db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()
	var cc []schema.Cc
	// USE BULK QUERY ETC
	err = database.Model(&schema.Cc{}).Where("username = ?", username).Where("draft = ?", false).Scopes(db.OrderByCreatedDate(r), db.Paginate(r)).Find(&cc).Error
	if err != nil {
		log.Println(err)
	}
	var tot int64
	err = database.Model(&schema.Cc{}).Where("username = ?", username).Where("draft = ?", false).Count(&tot).Error
	var summaries []dtos.CcSummary
	for _, chain := range cc {
		var summary *dtos.CcSummary = new(dtos.CcSummary)
		summary.FromSchema(&chain)
		summaries = append(summaries, *summary)
	}
	var ret dtos.SearchResponse
	ret.Summary, ret.Total = summaries, tot
	if uname != "" {
		ret.LoggedIn = true
	}
	responses.JSON(w, http.StatusAccepted, ret)

}
