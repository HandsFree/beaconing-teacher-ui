package types

import (
	"crypto/sha512"
	"fmt"
)

// CurrentUser contains the information on the current user, including
// their id and their username.
// https://core.beaconing.eu/api-docs/#!/currentuser/getCurrentUser
type CurrentUser struct {
	Id       int
	Username string
}

// hash of the avatar is the id + username
func (c *CurrentUser) GetAvatarHash() []byte {
	hash := sha512.New()
	hash.Write([]byte(fmt.Sprintf("%d%s", c.Id, c.Username)))
	return hash.Sum(nil)
}
