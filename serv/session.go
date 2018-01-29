package serv

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/config"
	"git.juddus.com/HFC/beaconing/json"
	"github.com/gin-contrib/sessions"
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

//
// ─── AUTH ───────────────────────────────────────────────────────────────────────
//

// use an err instead of a bool here
func GetAuthToken(s *SessionContext) bool {
	session := sessions.Default(s.Context)

	requestCode := session.Get("code").(string)

	message, err := jsoniter.Marshal(json.TokenRequest{
		GrantType:    "authorization_code",
		Code:         requestCode,
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
		RedirectURI:  RedirectBaseLink,
	})

	if err != nil {
		log.Fatal(err)
		return false
	}

	const tokenLink = "https://core.beaconing.eu/auth/token"
	response, err := http.Post(tokenLink, "application/json", bytes.NewBuffer(message))
	if err != nil {
		log.Fatal(err)
		return false
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
		return false
	}

	var respToken json.TokenResponse
	if err := jsoniter.Unmarshal(body, &respToken); err != nil {
		log.Fatal(err)
		return false
	}

	session.Set("access_token", respToken.AccessToken)
	session.Set("refresh_token", respToken.RefreshToken)
	session.Set("token_type", respToken.TokenType)
	session.Save()
	return true
}

func (s *SessionContext) TryAuth(redirectPath string) string {
	// here we slap the redirect base link as well as
	// a redirect path on the end

	log.Println("We are trying to auth, redirecting back to", redirectPath)

	/* authLink := fmt.Sprintf("https://core.beaconing.eu/auth/auth?response_type=code%s%s%s%s%s%s%s%s",
	"&client_id=", config.ClientID,
	"&redirect_uri=", RedirectBaseLink, "/",
	"&redirect=", redirectPath, "/")
	*/

	session := sessions.Default(s.Context)
	accessToken := session.Get("code")
	for accessToken == nil {
		GetAuthToken(s)
		// check the token again
		// prolly do a timeout or retry or something here
		accessToken = session.Get("code")
	}
	return accessToken.(string)
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
