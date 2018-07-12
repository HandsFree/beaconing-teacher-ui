package api

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
)

// formatRequest generates string representation of a request
func formatRequest(r *http.Request) string {
	// Create return string
	var request []string
	// Add the request string
	url := fmt.Sprintf("%v %v %v", r.Method, r.URL, r.Proto)
	request = append(request, url)
	// Add the host
	request = append(request, fmt.Sprintf("Host: %v", r.Host))
	// Loop through headers
	for name, headers := range r.Header {
		name = strings.ToLower(name)
		for _, h := range headers {
			request = append(request, fmt.Sprintf("%v: %v", name, h))
		}
	}

	// If this is a POST, add post data
	if r.Method == "POST" {
		r.ParseForm()
		request = append(request, "\n")
		request = append(request, r.Form.Encode())
	}

	// Return the request as a string
	return strings.Join(request, "\n")
}

// DoTimedRequestBody ...
func DoTimedRequestBody(s *gin.Context, method string, url string, reqBody io.Reader) ([]byte, error, int) {
	return DoTimedRequestBodyHeaders(s, method, url, reqBody, map[string]string{
		"accept":        "application/json",
		"authorization": fmt.Sprintf("Bearer %s", GetAccessToken(s)),
	})
}

// DoTimedRequestBodyHeaders does a timed request of type {method} to {url} with an optional {reqBody}, if
// there is no body pass nil, as well as a timeout can be specified.
func DoTimedRequestBodyHeaders(s *gin.Context, method string, url string, reqBody io.Reader, headers map[string]string) ([]byte, error, int) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	req, err := http.NewRequest(method, url, reqBody)
	{
		for key, val := range headers {
			req.Header.Add(key, val)
		}
	}

	// HACK FIXME
	// sort of hacky but it should work fine.
	if method == "POST" || method == "PUT" {
		req.Header.Set("Content-Type", "application/json")
	}

	if err != nil {
		util.Error("DoTimedRequestBody", err.Error())
		return []byte{}, err, -1
	}

	resp, err := http.DefaultClient.Do(req.WithContext(ctx))
	if err != nil {
		util.Error("DoTimedRequestBody", err.Error())
		return []byte{}, err, resp.StatusCode
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		util.Error("DoTimedRequestBody", err.Error())
		return []byte{}, err, resp.StatusCode
	}

	return body, nil, resp.StatusCode
}

// DoTimedRequest is the same as DoTimedRequestBody, however it does not have
// a body passed to the request.
func DoTimedRequest(s *gin.Context, method string, url string) ([]byte, error, int) {
	data, err, status := DoTimedRequestBody(s, method, url, nil)
	return data, err, status
}
