package controllers

import (
	"calipv2/cc_service/crud"
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/user_service/dtos"
	"calipv2/utils/responses"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

// WILL REQUIRE A DTO but FIRST CC
// if USER logged in then send drafts, cards, bookmarks by user and user info and editable option
// if USER not logged in then send only cards by user and user info
func GetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uname, found := vars["uname"]
	if !found {
		w.WriteHeader(http.StatusUnprocessableEntity)
		fmt.Fprintf(w, "%s", "invalid username")
		return
	} // NOT NEEDED

	// get the username
	tokk := r.Header.Get("Token")
	var payload *token.Payload
	if tokk != "" {
		maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
		payload, err = maker.VerifyToken(tokk)
		if err != nil {
			payload = &token.Payload{}
		}
	} else {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("user not logged in"))
		return
	}

	// form the dto
	var dto *dtos.ProfileDTO = dtos.NewProfileDTO()
	if payload.Username != "" {
		dto.LoggedIn = true // some one is there
	}
	if payload.Username == uname {
		dto.Editable = true // same user is there
	}

	// start the database
	database, err := db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()

	// search the database
	var user schema.User
	err = database.Model(&schema.User{}).Where("username = ?", uname).Find(&user).Error
	switch err {
	case nil:
	case gorm.ErrRecordNotFound:
		responses.ERROR(w, http.StatusNotFound, gorm.ErrRecordNotFound)
		return
	default:
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// form the dto now
	dto.FromSchema(&user)

	// more db calls to populate drafts, cards, bookmarks
	if dto.Editable {
		dto.Drafts, err = crud.GetDraftsFromDB(database, dto.Username)
		if err != nil {
			log.Println("coudnot fetch drafts, cards or bookmarks from db")
		}
	}
	dto.Cards, err = crud.GetCardsFromDB(database, dto.Username)
	if dto.Editable {
		dto.Bookmarks, err = crud.GetBookMarkCardsFromDB(database, dto.Username)
		if err != nil {
			log.Println("coudnot fetch drafts, cards or bookmarks from db")
		}
	}

	// return the response
	responses.JSON(w, http.StatusAccepted, *dto)
	return

}
