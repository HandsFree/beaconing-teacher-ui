package serv

import (
	"log"
	"net"

	"github.com/gin-gonic/gin"
)

//
// ─── VARS ───────────────────────────────────────────────────────────────────────
//

// Protocol contains the server protocol (http or https)
var Protocol = getProtocol()

// BaseLink contains the server address
var BaseLink = getBaseLink()

// RedirectBaseLink contains the link core services redirects back to
var RedirectBaseLink = getRedirectBaseLink()

// LogOutLink is used to log out
var LogOutLink = getProtocol() + BaseLink + "/"

// ────────────────────────────────────────────────────────────────────────────────

func getOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}

func getProtocol() string {
	if gin.IsDebugging() {
		return "http://"
	}

	return "https://"
}

func getBaseLink() string {
	if gin.IsDebugging() {
		// we have to slap the port on there
		return getOutboundIP().String() + ":8081"
	}
	return "teacher.beaconing.eu"
}

func getRedirectBaseLink() string {
	return getProtocol() + BaseLink + "/intent/token/"
}
