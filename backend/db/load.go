package db

import (
	"calipv2/schema"
	"calipv2/utils/console"
	"encoding/json"
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

	if err = db.DropTableIfExists(&schema.User{}, &schema.Cc{}, &schema.Tag{}).Error; err != nil {
		log.Fatal(err)
	}

	if err = db.DropTableIfExists(&schema.Bookmark{}, &schema.Category{}).Error; err != nil {
		log.Fatal(err)
	}

	// migrate schema
	if err = db.AutoMigrate(&schema.User{}, &schema.Cc{}, &schema.Tag{}).Error; err != nil {
		log.Fatal(err)
	}
	if err = db.AutoMigrate(&schema.Category{}, &schema.Bookmark{}).Error; err != nil {
		log.Fatal(err)
	}

	// update categories
	cats := getCategories() // []schema.categories
	for _, v := range cats {
		err = db.Model(&schema.Category{}).Create(&v).Error
		if err != nil {
			log.Println("couldnot push ", v)
		}
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
		//POPULATE tags too
		var tags []string
		_ = json.Unmarshal([]byte(cc.Tags), &tags)
		for _, tag := range tags {
			toPush := schema.Tag{
				Tag:  tag,
				Ccid: cc.ID,
			}
			err = db.Model(&schema.Tag{}).Create(&toPush).Error
			if err != nil {
				log.Println("COULD not PUSH", toPush, " err ", err)
			}
		}
		//-------
		console.Pretty(cc)
	}

	//load the bookmarks in the db
	//load the tags in the db

}

func Connect() (*gorm.DB, error) {
	db, err := gorm.Open("mysql",
		"root:@tcp(127.0.0.1:3306)/calip_v2?parseTime=true")
	if err != nil {
		return nil, err
	}
	return db, err
}
