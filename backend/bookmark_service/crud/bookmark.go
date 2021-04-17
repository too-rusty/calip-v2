package crud

import (
	"calipv2/bookmark_service/dtos"
	"calipv2/schema"

	"github.com/jinzhu/gorm"
)

// Save or remove bookmark depending on the save param
func SaveOrRemoveBookmarkDTO(db *gorm.DB, bookmark *dtos.BookmarkDTO) error {
	// convert from DTO to DAO and then save
	var err error
	if bookmark.Save {
		//save this bookmark
		var bmark schema.Bookmark
		bookmark.ToSchema(&bmark)
		//BUG creates multiple entries, should not be a problem for now
		err = db.Model(&schema.Bookmark{}).Create(&bmark).Error
	} else {
		//remove this bookmark
		err = db.Where("ccid = ?", bookmark.Ccid).Where("username = ?", bookmark.Username).Delete(&schema.Bookmark{}).Error
	}
	return err
}

// Given a bookmark, get the card if it is not deleted
// func GetBookMarkToCardFromDB(db *gorm.DB, bookmark *dtos.BookmarkDTO) (schema.Cc, error) {
// 	//return only those that are not draft and not deleted
// 	// curently for each one and later for bulk
// 	var card schema.Cc
// 	err := db.Model(&schema.Cc{}).Where("ID = ?", bookmark.Ccid).Find(&card).Error
// 	switch err {
// 	case nil:
// 		fallthrough
// 	case gorm.ErrRecordNotFound:
// 		return card, nil
// 	default:
// 		return card, err
// 	}
// }

// Is there bookmark available for a given uname and ccid
func IsBookMarked(db *gorm.DB, uname string, ccid uint) (bool, error) {
	var bookmark schema.Bookmark
	err := db.Model(&schema.Bookmark{}).Where("ccid = ?", ccid).Where("username = ?", uname).Find(&bookmark).Error
	// if err != nil {
	// 	return false, err
	// }
	// return true, nil // why not this
	switch err {
	case nil:
		return true, nil
	case gorm.ErrRecordNotFound:
		return false, nil
	default:
		return false, err
	}
}
