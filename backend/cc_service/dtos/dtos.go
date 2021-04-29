package dtos

import (
	"calipv2/schema"
	"encoding/json"
	"time"
)

// also map the dtos to the daos or the database model

type CcDTO struct {
	Ccid       uint     `json:"ccid"`
	Title      string   `json:"title"`
	About      string   `json:"about"`
	Content    []Card   `json:"content"`
	Tags       []string `json:"tags"`
	Username   string   `json:"username"`
	Draft      bool     `json:"draft"`
	Likes      int32    `json:"likes"`
	Start      int32    `json:"start"` // not using this for now
	Editable   bool     `json:"editable"`
	LoggedIn   bool     `json:"loggedin"`
	Bookmarked bool     `json:"bookmarked"`
	// TimeToEnd  int32    `json:"timetoend"` // time to finish the card can be used for a good purpose
}

//TODO

type Card struct {
	Content string `json:"content"`
	Link    string `json:"link"`
}
type Draft struct {
	Ccid      uint      `json:"ccid"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
	// maybe about too
}

func NewCcDTO() *CcDTO {
	return &CcDTO{}
}

func (c *CcDTO) InDB() bool {
	// maybe use an actual DB check
	if c.Ccid > 0 {
		return true
	}
	return false
}

func (c *CcDTO) ToSchema(cc *schema.Cc) error {
	if c.Ccid > 0 {
		cc.ID = c.Ccid // it may be the case that it is set else nope
	}
	cc.Title = c.Title
	cc.About = c.About
	content, err := json.Marshal(c.Content)
	if err != nil {
		return err
	}
	cc.Content = string(content)
	cc.Draft = c.Draft
	cc.Likes = c.Likes
	tags, err := json.Marshal(c.Tags)
	if err != nil {
		return err
	}
	cc.Tags = string(tags)
	cc.Username = c.Username
	return nil
}

func (c *CcDTO) FromSchema(cc *schema.Cc) error {
	c.Ccid = cc.ID
	c.Title = cc.Title
	c.About = cc.About
	var cards []Card
	if err := json.Unmarshal([]byte(cc.Content), &cards); err != nil {
		return err
	}
	c.Content = cards
	c.Draft = cc.Draft
	c.Likes = cc.Likes
	// c.Start ?? to fetch from db
	var tags []string
	if err := json.Unmarshal([]byte(cc.Tags), &tags); err != nil {
		return err
	}
	c.Tags = tags
	c.Username = cc.Username
	return nil
}

func (c *Draft) FromSchema(cc *schema.Cc) {
	c.Ccid = cc.ID
	c.Title = cc.Title
	c.UpdatedAt = cc.UpdatedAt
}
