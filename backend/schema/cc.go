package schema

import "github.com/jinzhu/gorm"

type Cc struct {
	gorm.Model
	Title    string `gorm:"type:text"`
	About    string `gorm:"type:text"`
	Content  string `gorm:"type:text"`
	Tags     string
	Username string `sql:"index"`
	Draft    bool
	Likes    int32 `sql:"index"`
}

// before save needs to be implemented
