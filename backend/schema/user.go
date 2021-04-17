package schema

import (
	"calipv2/utils"
	"log"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Username   string `sql:"index" json:"username"`
	Password   string `json:"password"`
	Email      string `json:"email"`
	Name       string `json:"name"`
	About      string `json:"about"`
	Profilepic string `json:"profilepic"`
}

func (u *User) BeforeSave() error {
	// maybe this error stops it
	hashed, err := utils.Hash(u.Password)
	if err != nil {
		log.Println("ERROR saving pass", err)
		return err
	}
	u.Password = string(hashed)
	return nil
}
