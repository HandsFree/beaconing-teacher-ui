package types

// CurrentUser contains the information on the current user, including
// their id and their username.
// https://core.beaconing.eu/api-docs/#!/currentuser/getCurrentUser

type teacherSettings struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Gender    string `json:"gender"`
	School    string `json:"school"`
}

type CurrentUser struct {
	Id              uint64          `json:"id"`
	Username        string          `json:"username"`
	Email           string          `json:"email"`
	Language        string          `json:"language"`
	Roles           []string        `json:"roles"`
	Accessibility   interface{}     `json:"accessibility"`
	TeacherSettings teacherSettings `json:"teacherSettings"`
	IdenticonSha512 string          `json:"identiconSha512"`
}
