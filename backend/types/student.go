package types

type Student struct {
	Id              uint64 `json:"id"`
	Username        string `json:"username"`
	IdenticonSha512 string `json:"identiconSha512"`
}
