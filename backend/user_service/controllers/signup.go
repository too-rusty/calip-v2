package controllers

import (
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/utils/responses"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/jinzhu/gorm"
)

// SIGNUP CONTROLLER, USER SIGNS UP
// TODO HANDLE DB CONNECTION
// TODO WHEN ALREADY SIGNED UP THEN RETURN ALREADY SIGNED SO THAT THE PAGE DOESNT OPEN
func Signup(w http.ResponseWriter, r *http.Request) {
	// IF USER ALREADY LOGGED IN , REDIRECT
	tokk := r.Header.Get("Token")
	if tokk != "" {
		maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
		_, err = maker.VerifyToken(tokk)
		if err == nil {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("user logged in"))
			return
		}
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // CANT READ BODY

	var tmpuser schema.User // RENAME
	err = json.Unmarshal(body, &tmpuser)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // WRONG JSON

	uname, email := tmpuser.Username, tmpuser.Email

	if uname == "" || email == "" {
		//cant be empty
		err = errors.New("uname or email cant be empty")
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // EMPTY UNAME OR EMAIL
	//check for invalid email too , TODO later

	//check if same username in db
	var database *gorm.DB
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()

	var user schema.User
	err = database.Model(&schema.User{}).Where("email = ? OR username = ?", email, uname).Find(&user).Error
	if errors.Is(err, nil) || errors.Is(err, gorm.ErrRecordNotFound) {
	} else {
		responses.ERROR(w, http.StatusInternalServerError, err) // better error message
		return
	}

	if user.Email == email || user.Username == uname {
		//WHAT HEADER and WHY HEADER also to check later
		err = errors.New("email or uname already exists")
		responses.ERROR(w, http.StatusBadRequest, err) // better error message
		return
	} // same email or username in db

	//create now
	done := make(chan bool)
	go func(done chan<- bool) {
		err = database.Model(&schema.User{}).Create(&tmpuser).Error
		if err != nil {
			done <- false
		}
		done <- true
	}(done)

	if <-done {
		responses.JSON(w, http.StatusAccepted, struct {
			Status string `json:"status"`
		}{
			Status: "OK",
		})
		return
	}

	responses.ERROR(w, http.StatusInternalServerError, err)

}
