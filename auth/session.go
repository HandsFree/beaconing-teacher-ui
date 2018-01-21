package auth

import (
	"crypto/rand"
)

// CreateSessionSecret returns a random byte array
func CreateSessionSecret(size int) []byte {
	sessionKey := make([]byte, size)

	_, err := rand.Read(sessionKey)
	if err != nil {
		panic(err)
	}

	return sessionKey
}
