package crud

import (
	"calipv2/schema"

	"github.com/jinzhu/gorm"
)

func SaveTagsToDB(db *gorm.DB, tags []string, ccid uint) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("ccid = ?", ccid).Delete(&schema.Tag{}).Error; err != nil {
			return err
		}
		// use bulk insert later
		for _, tag := range tags {
			insertTag := schema.Tag{Tag: tag, Ccid: ccid}
			if err := tx.Model(&schema.Tag{}).Create(&insertTag).Error; err != nil {
				return err
			}
		}
		return nil
	})
	return err
}
