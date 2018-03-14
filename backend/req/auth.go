package req

import (
	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/route"
	"git.juddus.com/HFC/beaconing/backend/serv"
)

// CheckAuthRequest holds route info
type CheckAuthRequest struct {
	route.SimpleManagedRoute
}

func (r *CheckAuthRequest) Post(s *serv.SessionContext)   {}
func (r *CheckAuthRequest) Delete(s *serv.SessionContext) {}

func (a *CheckAuthRequest) Get(s *serv.SessionContext) {
	accessToken := api.GetAccessToken(s)
	s.Jsonify(&CheckAuthJSON{
		Token: accessToken,
	})
}

type CheckAuthJSON struct {
	Token string `json:"token"`
}

func NewCheckAuthRequest(path string) *CheckAuthRequest {
	req := &CheckAuthRequest{}
	req.SetGET(path)
	return req
}
