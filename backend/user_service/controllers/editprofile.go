package controllers

import (
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/user_service/dtos"
	"calipv2/utils/responses"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/jinzhu/gorm"
)

func EditProfile(w http.ResponseWriter, r *http.Request) {
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
			responses.ERROR(w, http.StatusAccepted, errors.New("user not logged in"))
			return
		}
	} else {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("user not logged in"))
		return
	}

	// read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	} // CANT READ BODY
	var dto dtos.UpdateProfileDTO
	err = json.Unmarshal(body, &dto)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	//no need to check for diff username , cant happen mostly
	if payload.Username != dto.Username {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("diff uname, unauthorized"))
		return
	}

	// connect to db
	var database *gorm.DB
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()

	// push to db
	var user schema.User
	dto.ToSchema(&user)
	err = database.Model(&schema.User{}).Save(&user).Error
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// return proper status
	responses.JSON(w, http.StatusAccepted, struct {
		Status string `json:"status"`
	}{
		Status: "OK",
	})

}

func TestProfile(w http.ResponseWriter, r *http.Request) {
	// get the username
	tokk := r.Header.Get("token")
	var payload *token.Payload
	log.Println("tokk is", tokk)
	if tokk != "" {
		maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
		if err != nil {
			log.Println("ok1")
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
		payload, err = maker.VerifyToken(tokk)
		if err != nil {
			log.Println("ok2")
			responses.ERROR(w, http.StatusUnauthorized, err)
			return
		}
	} else {
		log.Println("ok3")
		responses.ERROR(w, http.StatusUnauthorized, errors.New("user not logged in"))
		return
	}

	database, err := db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()

	var user schema.User
	err = database.Model(&schema.User{}).Where("username = ?", payload.Username).Find(&user).Error
	if err != nil {
		log.Println("err4", err)
		responses.ERROR(w, http.StatusNotFound, err)
		return
	}

	// return proper status
	//FOUND THE BUG FINALLY , WHEN THE USER IS LOGGED IN AND THIS API IS CALLED AGAIN
	// TOKEN is NOT SEND FOR THE SECOND TIME
	responses.JSON(w, http.StatusAccepted, user)
}
