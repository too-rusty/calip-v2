package controllers

import (
	bc "calipv2/bookmark_service/crud"
	"calipv2/cc_service/dtos"
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/utils/responses"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

// get the card, if it is a draft then auth required else no
// first fetch the card from the db then convert into dto
// and then send
func Get(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	ccid, err := strconv.ParseUint(vars["ccid"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	var database *gorm.DB
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()
	var cc schema.Cc
	// OR better to search for non draft cards only and search for drafts in   /user/drafts   link
	if err := database.Model(&schema.Cc{}).Where("ID = ?", ccid).Find(&cc).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			responses.ERROR(w, http.StatusNotFound, err)
			return
		}
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// found
	ccDTO := dtos.NewCcDTO()
	ccDTO.FromSchema(&cc)
	//also search for the last page of this user
	tok := r.Header.Get("token")
	log.Println("tokk in get", tok)
	maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return // do we need this here ??
	}

	/*
		is user is logged in then it should be either bookmarked or not
		if the user logged in is same as the creator then editable option should be there
		also if the card is draft then check that it should be the same user
	*/

	var payload *token.Payload
	payload, err = maker.VerifyToken(tok)
	ccDTO.LoggedIn = true
	if err != nil {
		// token not valid
		ccDTO.LoggedIn = false
	} else if payload.Username == ccDTO.Username {
		// should be editable
		ccDTO.Editable = true
	} else {
		// should not be editable but logged in
	}

	// if ccDTO.Draft && (payload == nil || ccDTO.Username != payload.Username) {
	// 	// if it is a draft and user is not logged in or not the same user
	// 	responses.ERROR(w, http.StatusNotFound, errors.New("no card found"))
	// 	return
	// }

	if ccDTO.LoggedIn {
		ccDTO.Bookmarked, err = bc.IsBookMarked(database, payload.Username, ccDTO.Ccid)
		if err != nil {
			log.Println("Couldnot fetch bookmark uname ccid - err ", payload.Username, ccDTO.Ccid, err)
		}
	}

	responses.JSON(w, http.StatusAccepted, ccDTO)

}

/*

TODO -> Drafts , non drafts decision to make whether to display drafts or not
MADE -> maybe not, it should be displayed in drafts/id

EDITED AND CHECKED , LOOK FOR THIS MESSAGE AT THE END OF EVERY CONTROLLER TO VERIFY ITS CORRECTNESS

*/
