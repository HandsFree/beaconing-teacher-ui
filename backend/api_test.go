package main_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestIndex(t *testing.T) {
	body := gin.H{
		"hello":"world",
	}

	router := makeServer()

	w := performRequest(router, "GET", "/")

	jsonEncoded, err := json.Marshal(body)

	assert.Nil(t, err)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, string(jsonEncoded)+"\n", w.Body.String())
}

func makeServer() *gin.Engine {
	cfg.LoadConfig()
	api.SetupAPIHelper()

	return serv.GetRouterEngine()
}
