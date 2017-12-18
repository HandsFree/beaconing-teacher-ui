package serv

// hmm think about me

import (
	"bytes"
	"git.juddus.com/HFC/beaconing.git/auth"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"io/ioutil"
	"log"
	"net"
	"net/http"
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

// this should technically be some wrapper
// over gin.Context, we can embed the gin Context
// struct in this and then pass just this round instead?
// i feel like the name here is wrong too
// but this is carrying all of our context information
// like the router engine, and the token store database
type BeaconingServer struct {
	RouterEngine *gin.Engine
	TokenStore   *auth.TokenDatabase
}

func NewBeaconingInst(router *gin.Engine) *BeaconingServer {
	return &BeaconingServer{
		RouterEngine: router,
		TokenStore: &auth.TokenDatabase{
			DB: make(map[string]string),
		},
	}
}

// move this into a TokenDatabase
// thingy rather than modifying a global
// database thing?
func (serv *BeaconingServer) GetToken() {
	requestCode, _ := serv.TokenStore.Get("code")
	request := auth.TokenRequest{
		GrantType:    "authorization_code",
		Code:         requestCode,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURI:  redirectBaseLink,
	}

	message, err := jsoniter.Marshal(request)
	if err != nil {
		log.Fatal(err)
		return
	}

	// Obtains token from access code
	const tokenLink = "https://core.beaconing.eu/auth/token"
	response, err := http.Post(tokenLink, "application/json", bytes.NewBuffer(message))
	if err != nil {
		log.Fatal(err)
		return
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)

	if err != nil {
		log.Fatal(err)
		return
	}

	var respToken auth.TokenResponse

	err = respToken.FromJSON(body)
	if err != nil {
		log.Fatal(err)
		return
	}

	serv.TokenStore.Set("access_token", respToken.AccessToken)
	serv.TokenStore.Set("refresh_token", respToken.RefreshToken)
	serv.TokenStore.Set("token_type", respToken.TokenType)
}
