package dtos

type CategoryDTO struct {
	Category string   `json:"category"`
	Tags     []string `json:"tags"`
}
