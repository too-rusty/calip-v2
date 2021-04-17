package controllers

import (
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/utils"
	"calipv2/utils/responses"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/jinzhu/gorm"
)

// WRITE The TOKEN here and verify
// MAKE A DIFF DB CALLS THING
// TODO WHEN ALREADY LOGIN THEN SEND ALREADY LOGIN SO THAT THE PAGE DOESNT OPEN
func Login(w http.ResponseWriter, r *http.Request) {

	// IF USER ALREADY LOGGED IN , REDIRECT
	// this was not throwing error because handled in frontend
	tokk := r.Header.Get("token")
	if tokk != "" {
		maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
		_, err = maker.VerifyToken(tokk)
		//
		if err == nil {
			// lol error and ACCEPTED , what the heck
			responses.ERROR(w, http.StatusUnauthorized, errors.New("user logged in"))
			return
		}
	}

	// read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // CANT READ BODY

	tmpuser := struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}{} // RENAME
	err = json.Unmarshal(body, &tmpuser)
	log.Println("tmp user", tmpuser)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // WRONG JSON

	if tmpuser.Username == "" {
		//cant be empty
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("uname or email cant be empty"))
		return
	} // EMPTY UNAME OR EMAIL TO REMOVE, CHECK ON FRONTEND

	//check for invalid email too , TODO later

	var database *gorm.DB
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err) // better ERROR msg for frontend
		return
	}
	defer database.Close()

	var dbUser schema.User
	err = database.Model(&schema.User{}).Where("username = ?", tmpuser.Username).Find(&dbUser).Error
	switch err {
	case nil: // DO NOTHING
	case gorm.ErrRecordNotFound:
		responses.ERROR(w, http.StatusNotFound, errors.New("no such user"))
		return
	default:
		responses.ERROR(w, http.StatusInternalServerError, err) // better ERROR msg for frontend
		return
	}
	//wrong pass then cant login
	if err := utils.Compare(tmpuser.Password, dbUser.Password); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("wrong password"))
		return
	}

	//ISSUE NEW TOKEN
	maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err) // better ERROR msg for frontend
		return
	}

	var tok string
	tok, err = maker.CreateToken(dbUser.Username, time.Minute*20) // FOR 10 min now
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err) // better ERROR msg for frontend
		return
	}

	tokJson := struct {
		Token string `json:"token"`
		Uname string `json:"username"`
	}{
		Token: tok,
		Uname: dbUser.Username,
	}

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err) // better ERROR msg for frontend
		return
	}

	responses.JSON(w, http.StatusAccepted, tokJson)

}
