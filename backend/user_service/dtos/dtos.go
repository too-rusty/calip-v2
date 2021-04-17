package dtos

import (
	"calipv2/cc_service/dtos"
	"calipv2/schema"
)

type UpdateProfileDTO struct {
	Name       string `json:"name"`
	Username   string `json:"username"`
	Password   string `json:"password"`
	Email      string `json:"email"`
	Profilepic string `json:"profilepic"`
	About      string `json:"about"`
}

type ProfileDTO struct {
	Name       string `json:"name"`
	Username   string `json:"username"`
	Email      string `json:"email"`
	Profilepic string `json:"profilepic"`
	About      string `json:"about"`
	// need db calls for the below
	Drafts    []dtos.Draft `json:"drafts"`
	Cards     []dtos.CcDTO `json:"cards"`
	Bookmarks []dtos.CcDTO `json:"bookmarks"`
	Editable  bool         `json:"editable"` // if logged in and username same as payload username
	// is it the same user whose profile it is then show drafts and bookmarks
	LoggedIn bool `json:"loggedin"` // is someone logged in

}

func NewProfileDTO() *ProfileDTO {
	return &ProfileDTO{}
}

func (p *UpdateProfileDTO) ToSchema(u *schema.User) {
	u.About = p.About
	u.Email = p.Email
	u.Name = p.Name
	u.Password = p.Password
	u.Profilepic = p.Profilepic
	u.Username = p.Username
}

func (p *ProfileDTO) FromSchema(u *schema.User) {
	p.Name = u.Name
	p.Username = u.Username
	p.Email = u.Email
	p.Profilepic = u.Profilepic
	p.About = u.About
}
