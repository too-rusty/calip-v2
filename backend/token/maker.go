package token

import "time"

type Maker interface {
	// create a token for a given username
	CreateToken(username string, duration time.Duration) (string, error)

	// Verify token, checks if the token is valid or not
	VerifyToken(token string) (*Payload, error)
}
