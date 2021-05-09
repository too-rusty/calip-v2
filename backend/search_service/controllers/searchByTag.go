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

func SearchByTagname(w http.ResponseWriter, r *http.Request) {
	// IF USER ALREADY LOGGED IN , then set login
	tokk := r.Header.Get("Token") // need to correct this , although not needed
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

	tag := mux.Vars(r)["tag"]

	database, err := db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()
	var tags []schema.Tag
	err = database.Model(&schema.Tag{}).Where("tag = ?", tag).Scopes(db.OrderByCreatedDate(r), db.Paginate(r)).Find(&tags).Error
	if err != nil {
		log.Println(err)
	}
	var count int64
	err = database.Model(&schema.Tag{}).Where("tag = ?", tag).Count(&count).Error
	if err != nil {
		log.Println(err)
	}
	var summs []dtos.CcSummary
	for _, val := range tags {
		var cc schema.Cc
		err = database.Model(&schema.Cc{}).Where("ID = ?", val.Ccid).Where("draft = ?", false).Find(&cc).Error
		if err == nil {
			var summ *dtos.CcSummary = new(dtos.CcSummary)
			summ.FromSchema(&cc)
			summs = append(summs, *summ)
		}
	}
	var ret dtos.SearchResponse
	ret.Summary = summs
	ret.Total = count
	if uname != "" {
		ret.LoggedIn = true
	}
	responses.JSON(w, http.StatusAccepted, ret)
}
