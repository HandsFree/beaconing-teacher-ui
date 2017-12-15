package main

import (
	"sync"

	jsoniter "github.com/json-iterator/go"
)

// TokenDB is a struct with embedded mutex for the database which contains the token details
type TokenDB struct {
	sync.Mutex
	DB map[string]string
}

// Set adds or changes an entry
func (tdb *TokenDB) Set(key string, value string) {
	tdb.Lock()
	tdb.DB[key] = value
	tdb.Unlock()
}

// Get obtains an entry
func (tdb *TokenDB) Get(key string) (string, bool) {
	tdb.Lock()
	value, defined := tdb.DB[key]
	defer tdb.Unlock()
	return value, defined
}

// TokenRequest is a json type for the response from the tokenLink
type TokenRequest struct {
	GrantType    string `json:"grant_type"`
	Code         string `json:"code"`
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	RedirectURI  string `json:"redirect_uri"`
}

// TokenResponse describes the structure of the token recieved from the server
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
}

// FromJSON turns byte array containing JSON to a TokenResponse
func (tc *TokenResponse) FromJSON(respJSON []byte) error {
	return jsoniter.Unmarshal(respJSON, tc)
}

// AssignRequest is the structure of json to update a glp
type AssignRequest struct {
	StudentID string `json:"studentId"`
	GLP       string `json:"gamifiedLessonPathId"`
}
