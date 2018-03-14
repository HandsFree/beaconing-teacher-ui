package api

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"time"

	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/serv"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func AuthRedirect(c *gin.Context) {
	authLink := fmt.Sprintf("https://core.beaconing.eu/auth/auth?response_type=code%s%s%s%s",
		"&client_id=", cfg.Beaconing.Auth.ID,
		"&redirect_uri=", serv.RedirectBaseLink)
	c.Redirect(http.StatusTemporaryRedirect, authLink)
}

func GetRefreshToken(s *serv.SessionContext) error {
	session := sessions.Default(s.Context)

	accessToken := session.Get("access_token").(string)

	message, err := jsoniter.Marshal(types.TokenRequest{
		GrantType:    "authorization_code",
		Code:         accessToken,
		ClientID:     cfg.Beaconing.Auth.ID,
		ClientSecret: cfg.Beaconing.Auth.Secret,
		RedirectURI:  serv.RedirectBaseLink,
	})

	if err != nil {
		log.Println("GetRefreshToken", err.Error())
		return err
	}

	const tokenRefreshLink = "https://core.beaconing.eu/auth/token"
	resp, err := DoTimedRequestBody("POST", tokenRefreshLink, bytes.NewBuffer(message), 15*time.Second)
	if err != nil {
		log.Println("GetRefreshToken", err.Error())
		return err
	}

	var respToken types.TokenResponse
	if err := jsoniter.Unmarshal(resp, &respToken); err != nil {
		log.Println("GetRefreshToken", err.Error())
		return err
	}

	log.Println("Auth: Set access token!")
	session.Set("access_token", respToken.AccessToken)
	session.Set("refresh_token", respToken.RefreshToken)
	session.Set("token_type", respToken.TokenType)
	if err := session.Save(); err != nil {
		log.Println("GetRefreshToken", err.Error())
	}
	return nil
}

func GetAccessToken(s *serv.SessionContext) string {
	session := sessions.Default(s.Context)
	accessToken := session.Get("access_token")
	if accessToken == nil {
		s.SimpleErrorRedirect(401, "Unauthorised access")
		// NOTE: no return here due to redirect
		return ""
	}
	return accessToken.(string)
}

func TryRefreshToken(s *serv.SessionContext) error {
	err := GetRefreshToken(s)
	return err
}
