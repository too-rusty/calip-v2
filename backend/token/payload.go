package token

import (
	"errors"
	"time"
)

// contains the payload data of the token
type Payload struct {
	// ID uuid -> can be used to whitelist tokens but not now
	Username  string    `json:"username"`
	IssuedAt  time.Time `json:"issued_at"`
	ExpiredAt time.Time `json:"expired_at"`
}

func NewPayload(username string, duration time.Duration) (*Payload, error) {
	payload := &Payload{
		Username:  username,
		IssuedAt:  time.Now(),
		ExpiredAt: time.Now().Add(duration),
	}
	return payload, nil
}

func (p *Payload) Valid() error {
	if p.ExpiredAt.Before(time.Now()) {
		return errors.New("token expired")
	}
	return nil
}
