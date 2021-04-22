package schema

import "github.com/jinzhu/gorm"

type Category struct {
	gorm.Model
	Category string `sql:"index"`
	Tag      string `sql:"index"`
}
