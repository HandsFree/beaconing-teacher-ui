package serv

import (
	"crypto/rand"
	"fmt"
	"net/http"

	raven "github.com/getsentry/raven-go"
	"github.com/gin-contrib/sentry"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/thinkerou/favicon"
)

// TokenAuth ...
// simple middleware to handle token auth
func TokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Request.FormValue("code")

		session := sessions.Default(c)
		accessToken := session.Get("access_token")

		if code == "" && accessToken == nil {
			// we have no code and no access
			// token so lets ask for auth
			authLink := fmt.Sprintf("https://core.beaconing.eu/auth/auth?response_type=code%s%s%s%s",
				"&client_id=", cfg.Beaconing.Auth.ID,
				"&redirect_uri=", api.GetRedirectBaseLink())
			c.Redirect(http.StatusTemporaryRedirect, authLink)
			return
		}

		c.Next()
	}
}

// CreateSessionSecret returns a random byte array
func createSessionSecret(size int) []byte {
	sessionKey := make([]byte, size)

	_, err := rand.Read(sessionKey)
	if err != nil {
		panic(err)
	}

	return sessionKey
}

func GetRouterEngine() *gin.Engine {
	router := gin.Default()

	// use ssessions with cookie store
	store := cookie.NewStore(createSessionSecret(32), createSessionSecret(16))
	router.Use(sessions.Sessions("beaconing", store))

	// gzip resources
	router.Use(gzip.Gzip(gzip.BestSpeed))

	// Add favicon
	router.Use(favicon.New("./favicon.ico"))

	// token auth middleware
	router.Use(TokenAuth())

	// Add sentry for development
	router.Use(sentry.Recovery(raven.DefaultClient, false))

	// 404 page.
	router.NoRoute(func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNotFound)
	})

	// Load the main template file
	router.LoadHTMLFiles("./templates/index.html", "./templates/unauthorised_user.html")

	// Serve all static files
	router.Static("/dist", "./../frontend/public/dist")

	router.RedirectTrailingSlash = true

	registerPages(router)
	registerWidgets(router)
	registerAPI(router)

	return router
}
