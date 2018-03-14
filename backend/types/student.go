package types

type Student struct {
	Id              int    `json:"id"`
	Username        string `json:"username"`
	IdenticonSha512 string `json:"identiconSha512"`
}
