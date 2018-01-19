package serv

// hmm think about me

import (
	"bytes"
	"io/ioutil"
	"log"
	"net"
	"net/http"

	"git.juddus.com/HFC/beaconing/auth"
	"git.juddus.com/HFC/beaconing/config"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// NOTE:
// these are no longer consts! they should
// stay constant but this is technically
// no longer enforced by the compiler
// when this goes out in production we should change
// this but for now we calculate the IP at runtime
// therefore we must have it as "var" because
// we cant run a function at compile-time as a compile-time const :(

func getOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}

func getRedirectBaseLink() string {
	if gin.IsDebugging() {
		// we have to slap the port on there
		return getOutboundIP().String() + ":8081"
	}
	return "bcn-dev.ejudd.uk"
}

// Base link for api redirects
var redirectBaseLink = "http://" + getRedirectBaseLink() + "/intent/token/"

// Provides an access code to retrieve and access token
var AuthLink = "https://core.beaconing.eu/auth/auth?response_type=code&client_id=teacherui&redirect_uri=" + redirectBaseLink

type SessionContext struct {
	*gin.Context
	RouterEngine *gin.Engine
	TokenStore   *auth.TokenDatabase
}

func NewSessionContext(router *gin.Engine) *SessionContext {
	return &SessionContext{
		RouterEngine: router,
		TokenStore: &auth.TokenDatabase{
			DB: make(map[string]string),
		},
	}
}

// use an err instead of a bool here
func (s *SessionContext) GetAuthToken() bool {
	requestCode, _ := s.TokenStore.Get("code")

	message, err := jsoniter.Marshal(auth.TokenRequest{
		GrantType:    "authorization_code",
		Code:         requestCode,
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
		RedirectURI:  redirectBaseLink,
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

	var respToken auth.TokenResponse
	if err := jsoniter.Unmarshal(body, &respToken); err != nil {
		log.Fatal(err)
		return false
	}

	s.TokenStore.Set("access_token", respToken.AccessToken)
	s.TokenStore.Set("refresh_token", respToken.RefreshToken)
	s.TokenStore.Set("token_type", respToken.TokenType)
	return true
}
