package types

// CurrentUser contains the information on the current user, including
// their id and their username.
// https://core.beaconing.eu/api-docs/#!/currentuser/getCurrentUser
type CurrentUser struct {
	Id              uint64 `json:"id"`
	Username        string `json:"username"`
	IdenticonSha512 string `json:"identiconSha512"`
}
