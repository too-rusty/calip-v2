package dtos

import "calipv2/schema"

type BookmarkDTO struct {
	Username string `json:"username"`
	Ccid     uint   `json:"ccid"`
	Save     bool   `json:"save"`
}

func (dto *BookmarkDTO) ToSchema(bs *schema.Bookmark) {
	bs.Ccid = dto.Ccid
	bs.Username = dto.Username
}

func (dto *BookmarkDTO) FromSchema(bs *schema.Bookmark) {
	dto.Ccid = bs.Ccid
	dto.Username = bs.Username
}
