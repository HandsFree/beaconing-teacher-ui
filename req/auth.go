package req

import (
	"github.com/gin-contrib/sessions"

	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
)

// CheckAuthRequest holds route info
type CheckAuthRequest struct {
	route.SimpleManagedRoute
}

// CheckAuthJSON details json structure
type CheckAuthJSON struct {
	Status bool `json:"status"`
}

// NewCheckAuthRequest returns initialised request struct
func NewCheckAuthRequest(path string) *CheckAuthRequest {
	req := &CheckAuthRequest{}
	req.SetPath(path)
	return req
}

// Handle handles incoming requests
func (r *CheckAuthRequest) Handle(s *serv.SessionContext) {
	authJSON := &CheckAuthJSON{
		Status: true,
	}

	session := sessions.Default(s.Context)

	accessToken := session.Get("access_token")
	if accessToken == nil {
		authJSON.Status = false
	}

	s.Jsonify(authJSON)
}
