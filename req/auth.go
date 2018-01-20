package req

import (
	"log"
	"net/http"

	"github.com/json-iterator/go"

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
	_, keyDefined := s.TokenStore.Get("access_token")
	if !keyDefined {
		authJSON.Status = false
	}

	marshalJSON, err := jsoniter.Marshal(authJSON)
	if err != nil {
		log.Fatal(err)
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(marshalJSON))
}
