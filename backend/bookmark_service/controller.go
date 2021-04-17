package bookmark_service

import (
	"calipv2/bookmark_service/crud"
	"calipv2/bookmark_service/dtos"
	"calipv2/db"
	"calipv2/token"
	"calipv2/utils/responses"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/jinzhu/gorm"
)

func createORremove(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	// verify the token
	tok := r.Header.Get("token")
	maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	_, err = maker.VerifyToken(tok)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("invalide token or not logged in"))
		return
	}

	// save to db
	var dto dtos.BookmarkDTO
	err = json.Unmarshal(body, &dto)
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
	err = crud.SaveOrRemoveBookmarkDTO(database, &dto)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusAccepted, "OK")

}

func get(w http.ResponseWriter, r *http.Request) {
	// get all bookmarks id by the user
	// get all the titles etc of the bookmark
}
