package main

// Base link for api redirects
const redirectBaseLink = "http://109.151.204.151:8081/intent/token/"

// Provides an access code to retrieve and access token
const authLink = "https://core.beaconing.eu/auth/auth?response_type=code&client_id=teacherui&redirect_uri=" + redirectBaseLink

// Obtains token from access code
const tokenLink = "https://core.beaconing.eu/auth/token"
