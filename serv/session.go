package serv

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// SessionContext...
// a light wrapper over the gin contexts
type SessionContext struct {
	*gin.Context
	RouterEngine *gin.Engine
}

func NewSessionContext(router *gin.Engine) *SessionContext {
	return &SessionContext{
		RouterEngine: router,
	}
}

// SimpleErrorRedirect...
// Creates a really simple error message JSON response
// and aborts the current session
func (s *SessionContext) SimpleErrorRedirect(code int, message string) {
	s.Header("Content-Type", "application/json")
	s.String(code, `"error": `+message)
	s.Abort()
}

// Json...
// Spits out the given json code in a 200 status page
func (s *SessionContext) Json(code string) {
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, code)
}

// Jsonify...
// Spits out the given interfaces as a jsonified string
// in a 200 status page
func (s *SessionContext) Jsonify(things interface{}) {
	json, err := jsoniter.Marshal(things)
	if err != nil {
		log.Println("SessionContext", err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(json))
}
