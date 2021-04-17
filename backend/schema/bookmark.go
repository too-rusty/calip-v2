package schema

import "github.com/jinzhu/gorm"

type Bookmark struct {
	gorm.Model
	Username string `sql:"index"`
	Ccid     uint   `sql:"index"`
}
