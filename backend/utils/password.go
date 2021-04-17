package utils

import "golang.org/x/crypto/bcrypt"

func Hash(s string) (string, error) {
	p, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(p), nil
}

func Compare(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
