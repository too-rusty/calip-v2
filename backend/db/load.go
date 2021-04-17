package db

import (
	"calipv2/schema"
	"calipv2/utils/console"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

func Load() {
	db, err := Connect()
	if err != nil {
		log.Fatal(err)
	}
	db = db.Debug()
	defer db.Close()

	if err = db.DropTableIfExists(&schema.User{}, &schema.Cc{}, &schema.Tag{}, &schema.Bookmark{}).Error; err != nil {
		log.Fatal(err)
	}

	// migrate schema
	if err = db.AutoMigrate(&schema.User{}, &schema.Cc{}, &schema.Tag{}, &schema.Bookmark{}).Error; err != nil {
		log.Fatal(err)
	}

	users, err := getUserData()
	if err != nil {
		log.Fatal(err)
	}
	for _, user := range users {
		err = db.Model(&schema.User{}).Create(&user).Error
		if err != nil {
			log.Fatal(err)
		}

		console.Pretty(user)
	}

	// load the cardchain schema into the db
	var ccs []schema.Cc
	ccs, err = getCcData()
	if err != nil {
		log.Fatal(err)
	}
	for _, cc := range ccs {
		err = db.Model(&schema.Cc{}).Create(&cc).Error
		if err != nil {
			log.Fatal(err)
		}
		console.Pretty(cc)
	}

}

func Connect() (*gorm.DB, error) {
	db, err := gorm.Open("mysql",
		"root:@tcp(127.0.0.1:3306)/calip-v2?parseTime=true")
	if err != nil {
		return nil, err
	}
	return db, err
}
