package db

import (
	"net/http"
	"strconv"

	"github.com/jinzhu/gorm"
)

func Paginate(r *http.Request) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		m := r.URL.Query()
		var page int
		var err error
		if len(m["page"]) > 0 {
			page, err = strconv.Atoi(m["page"][0])
		}
		//page == 0 means that no page was sent in the url , so take it as 1
		if page == 0 || err != nil {
			page = 1
		}
		var pageSize int
		if len(m["page_size"]) > 0 {
			pageSize, err = strconv.Atoi(m["page_size"][0])
		}

		switch {
		case err != nil:
			fallthrough
		case pageSize <= 0:
			pageSize = 10
		case pageSize > 100:
			pageSize = 100
		}

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}

func OrderByCreatedDate(r *http.Request) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		m := r.URL.Query()
		var ord_by_date bool
		if len(m["ord_by_date"]) > 0 && m["ord_by_date"][0] == "true" {
			ord_by_date = true
		}
		if ord_by_date {
			db.Order("created_at desc")
		}
		return db
	}
}
