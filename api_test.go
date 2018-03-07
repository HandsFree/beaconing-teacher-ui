package main

import (
	"fmt"
	"net/http/httptest"
	"testing"
)

func TestStart(t *testing.T) {
	r := GetRouterEngine()

	serv := httptest.NewServer(r)
	defer serv.Close()

	fmt.Println("Started test instance on URL", serv.URL)
}
