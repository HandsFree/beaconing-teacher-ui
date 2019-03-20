package api

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/patrickmn/go-cache"

	"github.com/gin-gonic/gin"

	// psql stuff
	_ "github.com/lib/pq"

	"net"

	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
)

// ApiLayer is a layer which handles manipulation of
// sending and retrieving data to the beaconing API

// API is the main instance to the api helper
// this performs any api requests necessary
var API *CoreAPIManager

// timeout for api requests (set to 120 seconds temporarily)
const timeout = 120 * time.Second

// ────────────────────────────────────────────────────────────────────────────────

// GetOutboundIP is a helper function to get the
// current computers outbound IP.
func GetOutboundIP() net.IP {
	if cfg.Beaconing.Server.Local {
		return net.ParseIP("127.0.0.1")
	}

	conn, err := net.Dial("udp", "1.1.1.1:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP
}

// GetProtocol returns the protocol in which
// the server should run in. By default this is
// https, unless the host string contains the protocol.
// If gin is running in debug mode, it will run in HTTP.
//
// this assumption is made as debug mode will only be
// run locally and not in production so https is not necessary
// or easily configurable
func GetProtocol() string {
	if gin.IsDebugging() {
		return "http://"
	}

	if strings.HasPrefix(cfg.Beaconing.Server.Host, "https://") || strings.HasPrefix(cfg.Beaconing.Server.Host, "http://") {
		return ""
	}

	return "https://"
}

// GetBaseLink returns the base server host
// link, this is loaded from the configuration file
// however, when gin is in debug mode this is
// the computers ip with the port (loaded from the config file)
func GetBaseLink() string {
	if gin.IsDebugging() {
		// ip:port - we append the port in debug mode.
		return fmt.Sprintf("%s:%d", GetOutboundIP().String(), cfg.Beaconing.Server.Port)
	}

	host := cfg.Beaconing.Server.Host

	if host == "" {
		log.Fatal("Server Host not defined in config!")
	}

	return cfg.Beaconing.Server.Host
}

func getRootPath() string {
	return GetProtocol() + GetBaseLink()
}

// GetRedirectBaseLink returns the link for
// redirecting the api tokens
func GetRedirectBaseLink() string {
	return getRootPath() + "/api/v1/token/"
}

// GetLogOutLink ...
func GetLogOutLink() string {
	return GetProtocol() + GetBaseLink() + "/"
}

// SetupAPIHelper sets up an instanceof the API manager
// should not be called more than once (in theory!)
func SetupAPIHelper() {
	API = newAPIHelper()
}

// CoreAPIManager manages all of the api middleman requests, etc.
// as well as caching any json/requests that are frequently requested
type CoreAPIManager struct {
	APIPath string
	cache   *cache.Cache
}

// getPath creates an API path, appending on the given beaconing URL
// "https://core.beaconing.eu/api/", this makes concatenation painless
// as well as it slaps the access token on the end
func (a *CoreAPIManager) getPath(s *gin.Context, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s", path)
}

// hm.
func Cache() *cache.Cache {
	return API.cache
}

// TODO the toml layout for loading the
// database could be a lot better.
// but for now it works.
func newAPIHelper() *CoreAPIManager {
	return &CoreAPIManager{
		// TODO change this to be a config setting
		APIPath: "https://core.beaconing.eu/api/",
		cache:   cache.New(30*time.Minute, 10*time.Minute),
	}
}
