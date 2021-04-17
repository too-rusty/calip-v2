package crud

import (
	"calipv2/cc_service/dtos"
	"calipv2/schema"
	"log"

	"github.com/jinzhu/gorm"
)

// Get a particular users Drafts from the db
func GetDraftsFromDB(db *gorm.DB, uname string) (drafts []dtos.Draft, err error) {
	var dbCards []schema.Cc
	err = db.Model(&schema.Cc{}).Where("username = ?", uname).Where("draft = ?", true).Limit(100).Find(&dbCards).Error
	if err == gorm.ErrRecordNotFound {
		return drafts, nil
	}
	if err != nil {
		return drafts, err
	}
	for _, card := range dbCards {
		var draft dtos.Draft
		draft.FromSchema(&card)
		drafts = append(drafts, draft)
	}
	return
}

// Get a particular users published cards from the db
func GetCardsFromDB(db *gorm.DB, uname string) (cards []dtos.CcDTO, err error) {
	var dbCards []schema.Cc
	err = db.Model(&schema.Cc{}).Where("username = ?", uname).Where("draft = ?", false).Limit(100).Find(&dbCards).Error
	if err == gorm.ErrRecordNotFound {
		return cards, nil
	}
	if err != nil {
		return cards, err
	}
	for _, card := range dbCards {
		var dto dtos.CcDTO
		err = dto.FromSchema(&card)
		if err != nil {
			return
		}
		cards = append(cards, dto)
	}
	return
}

// Get a particular users bookmarks from the db
func GetBookMarkCardsFromDB(db *gorm.DB, uname string) (cards []dtos.CcDTO, err error) {
	// crud.GetBookMarkToCardFromDB(db, &bookmark)
	//first get the ids
	var bookmarks []schema.Bookmark
	var ids []uint
	err = db.Model(&schema.Bookmark{}).Where("username = ?", uname).Find(&bookmarks).Error
	if err != nil {
		return
	}
	for _, bm := range bookmarks {
		ids = append(ids, bm.Ccid)
	}
	log.Println("fetched ids", ids)
	var dbCards []schema.Cc
	for _, id := range ids {
		var dbCard schema.Cc
		err = db.Model(&schema.Cc{}).Where("ID = ?", id).Where("draft = ?", false).Find(&dbCard).Error
		if err == nil {
			dbCards = append(dbCards, dbCard)
		}
	}
	for _, dbCard := range dbCards {
		var card dtos.CcDTO
		err = card.FromSchema(&dbCard)
		if err == nil {
			cards = append(cards, card)
		}
	}
	return
}
