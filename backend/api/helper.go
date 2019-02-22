package api

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"database/sql"

	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/allegro/bigcache"
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
	if os.Getenv("USELOCAL") == "1" {
		return net.ParseIP("127.0.0.1")
	}

	conn, err := net.Dial("udp", "8.8.8.8:80")
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

const CachingDisabled = true

type CacheWrapper struct {
	*bigcache.BigCache
}

func newCacheWrapper(inst *bigcache.BigCache) *CacheWrapper {
	return &CacheWrapper{inst}
}

func (c *CacheWrapper) Get(key string) ([]byte, error) {
	if CachingDisabled {
		return []byte{}, errors.New("Caching disabled")
	}
	return c.BigCache.Get(key)
}

func LittleCacheInstance() *CacheWrapper {
	return API.littleCache
}

func BigCacheInstance() *CacheWrapper {
	return API.cache
}

// CoreAPIManager manages all of the api middleman requests, etc.
// as well as caching any json/requests that are frequently requested
type CoreAPIManager struct {
	APIPath     string
	littleCache *CacheWrapper
	cache       *CacheWrapper
	db          *sql.DB
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

// TODO the toml layout for loading the
// database could be a lot better.
// but for now it works.
func newAPIHelper() *CoreAPIManager {
	util.BigLog(util.VerboseLog, "Creating new API instance:\n",
		"* DB USER:", cfg.Beaconing.DB.Username, "\n",
		"* DB PASS:", cfg.Beaconing.DB.Password, "\n",
		"* DB NAME:", cfg.Beaconing.DB.Name, "\n",
		"* DB SSL ENABLED:", cfg.Beaconing.DB.SSL)

	sslMode := "verify-full"
	if !cfg.Beaconing.DB.SSL {
		sslMode = "disable"
	}

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s",
		cfg.Beaconing.DB.Username,
		cfg.Beaconing.DB.Password,
		cfg.Beaconing.DB.Name,
		sslMode)

	util.Verbose("Attempting connection to PSQL database")

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		util.Fatal("Failed to open db conn", err.Error())
	}

	err = db.Ping()
	if err != nil {
		util.Fatal("Failed to open db conn", err.Error())
	}

	util.Verbose("Database connection established")

	// the smaller cache is for more smaller cache
	// writes which are perhaps more frequent and
	// in addition are cached for less time.
	littleCache, err := bigcache.NewBigCache(bigcache.Config{
		Shards:             1024,
		LifeWindow:         1 * time.Minute,
		MaxEntriesInWindow: 1000 * 10 * 60,
		MaxEntrySize:       500,
		Verbose:            true,
		HardMaxCacheSize:   8192,
		OnRemove:           nil,
	})

	// this is the big cache which is for larger
	// caches, e.g. the /glps request which will
	// return a 16 MB response..
	cache, err := bigcache.NewBigCache(bigcache.Config{
		// number of shards (must be a power of 2)
		Shards: 1024,

		// time after which entry can be evicted
		LifeWindow: 10 * time.Minute,

		// rps * lifeWindow, used only in initial memory allocation
		MaxEntriesInWindow: 1000 * 10 * 60,

		// max entry size in bytes, used only in initial memory allocation
		// -- about a 24mb max entry.
		MaxEntrySize: 8192 * 3,

		// prints information about additional memory allocation
		Verbose: true,

		// NOTICE
		// glp is assumed to be around a 16 MB request so 16384
		// bytes. the hard max cache size allows for 32 of these requests
		// (also used for other data we cache)

		// cache will not allocate more memory than this limit, value in MB
		// if value is reached then the oldest entries can be overridden for the new ones
		// 0 value means no size limit
		HardMaxCacheSize: 16384 * 32,

		// callback fired when the oldest entry is removed because of its expiration time or no space left
		// for the new entry, or because delete was called. A bitmask representing the reason will be returned.
		// Default value is nil which means no callback and it prevents from unwrapping the oldest entry.
		OnRemove: nil,
	})

	if err != nil {
		log.Println("failed to initialize cache")
	}

	return &CoreAPIManager{
		APIPath:     "https://core.beaconing.eu/api/",
		littleCache: newCacheWrapper(littleCache),
		cache:       newCacheWrapper(cache),
		db:          db,
	}
}
