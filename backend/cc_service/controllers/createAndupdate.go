package controllers

import (
	"calipv2/cc_service/crud"
	"calipv2/cc_service/dtos"
	"calipv2/db"
	"calipv2/schema"
	"calipv2/token"
	"calipv2/utils/responses"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/jinzhu/gorm"
)

// create the card AND update
// if card not created then create and return the ccid
// if card already created then update the draft / card
func CreateAndUpdate(w http.ResponseWriter, r *http.Request) {
	//check token stuff
	tok := r.Header.Get("Token")
	maker, err := token.NewPasetoMaker("abcd1234abcd1234abcd1234abcd1234")
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	var payload *token.Payload
	payload, err = maker.VerifyToken(tok)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, err)
		return
	}

	// Read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	// Parse body
	var ccDTO dtos.CcDTO
	err = json.Unmarshal(body, &ccDTO)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	ccDTO.Username = payload.Username // set the username in the payload

	// connect to db
	var database *gorm.DB
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()

	// push to db
	var cc schema.Cc
	ccDTO.ToSchema(&cc) //convert
	if ccDTO.InDB() {
		// already in db so simply update
		err = database.Model(&schema.Cc{}).Save(&cc).Error
	} else {
		// not in db so create fresh
		err = database.Model(&schema.Cc{}).Create(&cc).Error
	}
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	// save the tags to the db
	// crud.SaveTagsToDB(database, ccDTO.Tags, cc.ID)
	crud.SaveTagsToDB(database, ccDTO.Tags, cc.ID)

	responses.JSON(w, http.StatusCreated, struct {
		Ccid uint `json:"ccid"`
	}{
		Ccid: cc.ID,
	})

}
