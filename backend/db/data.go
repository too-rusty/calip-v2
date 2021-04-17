package db

import (
	"calipv2/cc_service/dtos"
	"calipv2/schema"
	"encoding/json"
)

const data = `
[
	{"username":"aa","password":"kk","email":"a@a"},
	{"username":"bb","password":"ll","email":"b@b"},
	{"username":"cc","password":"mm","email":"c@c"}
]
`

func getUserData() (users []schema.User, err error) {
	err = json.Unmarshal([]byte(data), &users)
	if err != nil {
		return
	}
	return
}

func getCcData() (ccs []schema.Cc, err error) {
	cards := [][]dtos.Card{
		{
			{Content: "content1", Link: "link1"},
			{Content: "content2", Link: "link2"},
			{Content: "content3", Link: "link3"},
		},
		{
			{Content: "yoyo1", Link: "linker1"},
			{Content: "yoyo2", Link: "linker2"},
		},
	}
	ccs = []schema.Cc{
		{
			Title:    "anni's dillema",
			About:    "anni's dilemmas",
			Username: "anni",
			Draft:    true,
			Likes:    2,
		},
		{
			Title:    "anni2's dillema",
			About:    "anni2's dilemmas",
			Username: "anni2",
			Draft:    false,
			Likes:    3,
		},
	}
	for i := 0; i < len(ccs); i++ {
		var cardsBytes, tags []byte
		cardsBytes, err = json.Marshal(cards[i])
		tags, err = json.Marshal([]string{"tag1", "tag2"})
		if err != nil {
			return
		}
		ccs[i].Content = string(cardsBytes)
		ccs[i].Tags = string(tags)
	}

	return
}
