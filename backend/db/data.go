package db

import (
	"calipv2/cc_service/dtos"
	"calipv2/schema"
	"encoding/json"
	"fmt"
	"strconv"
)

const data = `
[
	{"username":"aa","password":"aa","email":"a@a"},
	{"username":"bb","password":"bb","email":"b@b"},
	{"username":"cc","password":"cc","email":"c@c"},
	{"username":"dd","password":"dd","email":"d@d"}
]
`

func getBookMarksData() (bookmarkschema []schema.Bookmark, err error) {
	for _, v := range bookmarks {
		var val uint64
		val, err = strconv.ParseUint(v[1], 10, 64)
		if err != nil {
			return
		}
		bs := schema.Bookmark{Username: v[0], Ccid: uint(val)}
		bookmarkschema = append(bookmarkschema, bs)
	}
	return
}

func getUserData() (users []schema.User, err error) {
	err = json.Unmarshal([]byte(data), &users)
	if err != nil {
		return
	}
	return
}

func getCategories() []schema.Category {
	return categories
}

func getCcData() (ccs_ret []schema.Cc, err error) {
	fmt.Println("lens", len(cards), len(ccs))
	for i := 0; i < len(ccs); i++ {
		var cardsBytes, tag_byte []byte
		cardsBytes, err = json.Marshal(cards[i])
		tag_byte, err = json.Marshal(tags[i])
		if err != nil {
			return
		}
		ccs[i].Content = string(cardsBytes)
		ccs[i].Tags = string(tag_byte)
		ccs_ret = append(ccs_ret, ccs[i])
	}

	return
}

// ---------------------------------------
var cards [][]dtos.Card = [][]dtos.Card{
	{
		{Content: "content_a_1", Link: "link1"},
		{Content: "content_a_2", Link: ""},
		{Content: "content_a_3", Link: "link3"},
	},
	{
		{Content: "yoyo_b_1", Link: "linker1"},
		{Content: "yoyo_b_2", Link: ""},
	},
	{
		{Content: "content_c_1", Link: "cc1"},
		{Content: "content_c_2", Link: "cc2"},
		{Content: "content_c_3", Link: ""},
	},
	{
		{Content: "yoyo_d_1", Link: "linker1"},
		{Content: "yoyo_d_2", Link: ""},
	},
}
var ccs []schema.Cc = []schema.Cc{
	{
		Title:    "aa's card",
		About:    "aa's card",
		Username: "aa",
		Draft:    false,
		Likes:    2,
	},
	{
		Title:    "bb's card",
		About:    "bb's card",
		Username: "bb",
		Draft:    false,
		Likes:    3,
	},
	{
		Title:    "cc's card",
		About:    "cc's card",
		Username: "cc",
		Draft:    false,
		Likes:    2,
	},
	{
		Title:    "dd's card",
		About:    "dd's card",
		Username: "dd",
		Draft:    true,
		Likes:    3,
	},
}

var bookmarks [][]string = [][]string{
	{"aa", "2"},
	{"aa", "3"},
	{"aa", "4"},
	{"bb", "1"},
	{"bb", "3"},
}

var tags [][]string = [][]string{
	{"tag1", "tag2"},
	{"t1", "t2"},
	{"tag1", "t2"},
	{"t1", "tag2"},
}

// HARD CODED CATEGORIES DONT FORGET TO ADD IMP CATEGORIES HERE
var categories []schema.Category = []schema.Category{
	{Category: "Upskill", Tag: "webdev"},
	{Category: "Upskill", Tag: "coding"},
	{Category: "Upskill", Tag: "python"},
	{Category: "Upskill", Tag: "design"},
	{Category: "Upskill", Tag: "marketing"},
	{Category: "Upskill", Tag: "trading"},
	{Category: "Upskill", Tag: "language"},
	{Category: "Upskill", Tag: "yoga"},

	{Category: "Life", Tag: "health"},
	{Category: "Life", Tag: "mind"},
	{Category: "Life", Tag: "motivation"},

	{Category: "Trending", Tag: "covid"},

	{Category: "Exams", Tag: "cat"},
	{Category: "Exams", Tag: "ias"},
	{Category: "Exams", Tag: "interview"},

	{Category: "CS", Tag: "cpp"},
	{Category: "CS", Tag: "golang"},
	{Category: "CS", Tag: "javascript"},
	{Category: "CS", Tag: "machinelearning"},
}
