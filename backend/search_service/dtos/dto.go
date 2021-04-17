package dtos

import (
	"calipv2/schema"
	"encoding/json"
)

type SearchResponse struct {
	Summary []CcSummary `json:"summary"`
	Total   int64       `json:"total"`
	// Recommmend []string    `json:"recommend"` // dont need this because the card contains the tags
	// parse it and recommend it on frontend
	LoggedIn bool `json:"loggedin"`
}

type CcSummary struct {
	Ccid     uint     `json:"ccid"`
	Title    string   `json:"title"`
	About    string   `json:"about"`
	Tags     []string `json:"tags"`
	Username string   `json:"username"`
}

func (ccs *CcSummary) FromSchema(cc *schema.Cc) error {
	ccs.Ccid = cc.ID
	ccs.Title = cc.Title
	ccs.About = cc.About
	ccs.Username = cc.Username
	err := json.Unmarshal([]byte(cc.Tags), &ccs.Tags)
	if err != nil {
		return err
	}
	return nil
}
