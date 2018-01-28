package json

/**
 * Not sure if these should stay here, better for now though.
 * Package name of json might not be the best thing
 */

// TokenRequest is a json type for the
// response from the tokenLink
type TokenRequest struct {
	GrantType    string `json:"grant_type"`
	Code         string `json:"code"`
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	RedirectURI  string `json:"redirect_uri"`
}

// TokenResponse describes the structure of
// the token recieved from the server
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
}
