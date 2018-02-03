package serv

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

//
// ─── STRUCTS ────────────────────────────────────────────────────────────────────
//

type SessionContext struct {
	*gin.Context
	RouterEngine *gin.Engine
}

// ────────────────────────────────────────────────────────────────────────────────

func NewSessionContext(router *gin.Engine) *SessionContext {
	return &SessionContext{
		RouterEngine: router,
	}
}

// temporary helper for simple error redirects
func (s *SessionContext) SimpleErrorRedirect(code int, message string) {
	resp := map[string]string{"error": message}
	s.JSON(code, resp)
	s.Abort()
}

//
// ─── JSON ───────────────────────────────────────────────────────────────────────
//

func (s *SessionContext) Json(code string) {
	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, code)
}

func (s *SessionContext) Jsonify(things interface{}) {
	json, err := jsoniter.Marshal(things)
	if err != nil {
		log.Fatal(err)
		return
	}

	s.Header("Content-Type", "application/json")
	s.String(http.StatusOK, string(json))
}
