package types

type Student struct {
	Id              uint64      `json:"id"`
	Username        string      `json:"username"`
	Email           string      `json:"email"`
	Profile         interface{} `json:"profile"`
	IdenticonSha512 string      `json:"identiconSha512"`
}
