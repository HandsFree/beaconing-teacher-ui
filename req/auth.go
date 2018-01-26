package req

import (
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

func (r *CheckAuthRequest) Handle(s *serv.SessionContext) {
	accessToken := s.TryAuth(a.GetPath())
	s.Jsonify(&CheckAuthJSON{
		Status: accessToken != nil,
	})
}
