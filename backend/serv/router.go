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

// GetRouterEngine is where the magic happens. This is the
// core router. Its been split up into this separate function for
// easily creating engine instances for external testing.
//
// this is invoked from main.go
func GetRouterEngine() *gin.Engine {
	router := gin.Default()

	// use ssessions with cookie store
	cookieStore := cookie.NewStore(createSessionSecret(32), createSessionSecret(16))

	router.Use(
		sessions.Sessions("beaconing", cookieStore),

		// gzip resources
		gzip.Gzip(gzip.BestSpeed),

		// specify favicon
		favicon.New("./favicon.ico"),

		// token auth middleware
		TokenAuth(),

		// sentry for dev logs
		sentry.Recovery(raven.DefaultClient, false),
	)

	// set a 404 for no route.
	router.NoRoute(func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNotFound)
	})

	// this is the main template file.
	router.LoadHTMLFiles("./templates/index.html", "./templates/unauthorised_user.html")

	// the dist with all the static files.
	router.Static("/dist", "./../frontend/public/dist")

	router.RedirectTrailingSlash = true

	registerPages(router)
	registerAPI(router)

	return router
}
