package entity

type Address struct {
	Line1    string `json:"line1"`
	Line2    string `json:"line2"`
	City     string `json:"city"`
	Country  string `json:"country"`
	County   string `json:"county"`
	PostCode string `json:"postcode"`
}

type Profile struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	// DOB is YYYY-MM-DD
	DOB     string  `json:"DOB"`
	Gender  string  `json:"gender"`
	School  string  `json:"school"`
	Address Address `json:"address"`
}

type Student struct {
	ID              uint64  `json:"id"`
	Username        string  `json:"username"`
	Email           string  `json:"email"`
	Language        string  `json:"language"`
	Profile         Profile `json:"profile"`
	IdenticonSha512 string  `json:"identiconSha512"`
}

type StudentPost struct {
	ID       uint64  `json:"id"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Language string  `json:"language"`
	Profile  Profile `json:"profile"`
}
