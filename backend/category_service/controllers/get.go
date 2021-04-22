package controllers

import (
	"calipv2/category_service/dtos"
	"calipv2/db"
	"calipv2/schema"
	"calipv2/utils/responses"
	"net/http"

	"github.com/jinzhu/gorm"
)

func Get(w http.ResponseWriter, r *http.Request) {
	var database *gorm.DB
	var err error
	database, err = db.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close()
	var categories []schema.Category

	if err = database.Model(&schema.Category{}).Find(&categories).Error; err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// group together all categories and cards
	var m map[string][]string = make(map[string][]string)
	groupByCategories(categories, m)
	var dto []dtos.CategoryDTO = make([]dtos.CategoryDTO, 0)
	for k := range m {
		something := dtos.CategoryDTO{
			Category: k,
			Tags:     m[k],
		}
		dto = append(dto, something)
	}

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusAccepted, dto)
}

func groupByCategories(categories []schema.Category, m map[string][]string) {
	for _, v := range categories {
		key, val := v.Category, v.Tag
		if _, ok := m[key]; !ok {
			m[key] = make([]string, 0)
		}
		m[key] = append(m[key], val)
	}
}
