package main

import (
	"net"
	"log"
)

// NOTE:
// these are no longer consts! they should
// stay constant but this is technically
// no longer enforced by the compiler
// when this goes out in production we should change
// this but for now we calculate the IP at runtime

func getOutboundIP() net.IP {
    conn, err := net.Dial("udp", "8.8.8.8:80")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    localAddr := conn.LocalAddr().(*net.UDPAddr)

    return localAddr.IP
}

// Base link for api redirects
var redirectBaseLink = "http://" + getOutboundIP().String() + ":8081/intent/token/"

// Provides an access code to retrieve and access token
var authLink = "https://core.beaconing.eu/auth/auth?response_type=code&client_id=teacherui&redirect_uri=" + redirectBaseLink

// Obtains token from access code
var tokenLink = "https://core.beaconing.eu/auth/token"
