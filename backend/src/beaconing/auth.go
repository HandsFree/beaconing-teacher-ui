package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"

	jsoniter "github.com/json-iterator/go"
)

func getToken() {
	go func() {
		requestCode, _ := tokenDetails.Get("code")
		request := TokenRequest{
			GrantType:    "authorization_code",
			Code:         requestCode,
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURI:  redirectBaseLink,
		}

		message, err := jsoniter.Marshal(request)
		if err != nil {
			log.Fatal(err)
			return
		}

		response, err := http.Post(tokenLink, "application/json", bytes.NewBuffer(message))

		if err != nil {
			log.Fatal(err)
			return
		}

		defer response.Body.Close()

		body, err := ioutil.ReadAll(response.Body)

		if err != nil {
			log.Fatal(err)
			return
		}

		// fmt.Println(string(body[:]))

		var respToken TokenResponse

		err = respToken.FromJSON(body)
		if err != nil {
			log.Fatal(err)
			return
		}

		tokenDetails.Set("access_token", respToken.AccessToken)
		tokenDetails.Set("refresh_token", respToken.RefreshToken)
		// tokenDetails.Set("expires_in", int(respToken.ExpiresIn))
		tokenDetails.Set("token_type", respToken.TokenType)

		// fmt.Println(tokenDetails.DB)
	}()
}

func checkToken() {

}
