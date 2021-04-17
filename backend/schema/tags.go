package schema

import "github.com/jinzhu/gorm"

type Tag struct {
	gorm.Model
	Tag  string `sql:"index"`
	Ccid uint   `sql:"index"`
}
