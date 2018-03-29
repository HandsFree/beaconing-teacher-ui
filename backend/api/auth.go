package api

import (
	"bytes"
	"errors"
	"log"
	"net/http"
	"time"

	"git.juddus.com/HFC/beaconing/backend/cfg"
	"git.juddus.com/HFC/beaconing/backend/types"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type AnalyticsUser struct {
	Id       string `json:"_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

func DoAnalyticsAuth(s *gin.Context) error {
	session := sessions.Default(s)

	type analyticsTokenPost struct {
		AccessToken string `json:"accessToken"`
	}

	accessTok := GetAccessToken(s)
	log.Println("Doing analytics auth with access token '" + accessTok + "'")

	if accessTok == "" {
		return errors.New("No access token!")
	}

	tokenReq := analyticsTokenPost{accessTok}
	message, err := jsoniter.Marshal(&tokenReq)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	const analyticsLink = "https://analytics.beaconing.eu/api/login/beaconing"
	resp, err := DoTimedRequestBodyHeaders(s, "POST", analyticsLink, bytes.NewBuffer(message), 15*time.Second, map[string]string{
		"accept": "application/json",
	})
	if err != nil {
		log.Println("DoAnalyticsAuth", err.Error())
		return err
	}

	// https://git.juddus.com/HFC/beaconing/wiki/Analytics
	/*
			{
		    "user": {
		        "_id": "<user id>",
		        "username": "teacher",
		        "email": "teacher@teacher.com",
		        "token": "<new auth token for analytics>"
		    }
		}
	*/

	log.Println("RESPONSE WAS", string(resp))

	var user struct {
		Data AnalyticsUser `json:"user"`
	}
	if err := jsoniter.Unmarshal(resp, &user); err != nil {
		log.Println(err.Error())
		return err
	}

	log.Println("ANALYTICS AUTH: Retrieved response!\n-", user.Data)

	session.Set("analytics_token", user.Data.Token)
	if err := session.Save(); err != nil {
		log.Println("DoAnalyticsAuth", err.Error())
		return err
	}
	return nil
}

// GetRefreshToken retrieves a refresh token from the beaconing
// core api. If all is well, the token will be set in the
// users session which can be referenced later.
func GetRefreshToken(s *gin.Context) error {
	session := sessions.Default(s)

	accessToken := session.Get("access_token").(string)

	message, err := jsoniter.Marshal(types.TokenRequest{
		GrantType:    "authorization_code",
		Code:         accessToken,
		ClientID:     cfg.Beaconing.Auth.ID,
		ClientSecret: cfg.Beaconing.Auth.Secret,
		RedirectURI:  GetRedirectBaseLink(),
	})

	if err != nil {
		log.Println("GetRefreshToken", err.Error())
		return err
	}

	const tokenRefreshLink = "https://core.beaconing.eu/auth/token"
	resp, err := DoTimedRequestBody(s, "POST", tokenRefreshLink, bytes.NewBuffer(message), 15*time.Second)
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

	if err := DoAnalyticsAuth(s); err != nil {
		log.Println("Failed to retrieve analytics token", err.Error())
		return err
	}

	return nil
}

// GetAccessToken will return the access token as a string
// if there is no token set then we spit out an unauthorised
// access error.
func GetAccessToken(s *gin.Context) string {
	session := sessions.Default(s)
	accessToken := session.Get("access_token")
	if accessToken == nil {
		s.String(http.StatusBadRequest, "Unauthorised access: core")
		// NOTE: no return here due to redirect
		return ""
	}
	return accessToken.(string)
}

func GetAnalyticsToken(s *gin.Context) string {
	session := sessions.Default(s)
	accessToken := session.Get("analytics_token")
	if accessToken == nil {
		s.String(http.StatusBadRequest, "Unauthorised access: analytics")
		// NOTE: no return here due to redirect
		return ""
	}
	return accessToken.(string)
}

// TryRefreshToken is a shim for trying to refresh
// a token ... to be implemented at a later date.
func TryRefreshToken(s *gin.Context) error {
	err := GetRefreshToken(s)
	return err
}
