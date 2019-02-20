package main_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/serv"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

// TestNoAuth checks if the authorisation fails on a normal page
// request! I.e. the server will do a 307 request to an auth page
// if we have not been authorised.
// TODO: we could probably check where we are redirected to, etc.
func TestNoAuth(t *testing.T) {
	router := makeServer()
	w := performRequest(router, "GET", "/")
	assert.Equal(t, http.StatusTemporaryRedirect, w.Code)
}

func TestAPI(t *testing.T) {
	go http.ListenAndServe(":8083", serv.GetRouterEngine())

	ctx, _ := gin.CreateTestContext(httptest.NewRecorder())
	api.GetCurrentUser(ctx)

	// todo set some kind of fake context up so
	// we can invoke the api and run some tests.
}

func makeServer() *gin.Engine {
	cfg.LoadConfig()
	api.SetupAPIHelper()
	return serv.GetRouterEngine()
}
