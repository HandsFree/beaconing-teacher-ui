package api

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"

	"github.com/patrickmn/go-cache"

	"github.com/HandsFree/beaconing-teacher-ui/backend/entity"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// GetUserID returns the current users id number, if there is no
// current user session it returns -1
func GetUserID(s *gin.Context) (uint64, error) {
	obj, _ := GetCurrentUser(s)
	if obj == nil {
		return 0, errors.New("No such user")
	}
	return obj.ID, nil
}

// GetCurrentUser returns an object with information about the current
// user, as well as the JSON string decoded from the object.
func GetCurrentUser(s *gin.Context) (*entity.CurrentUser, error) {
	resp, err, status := DoTimedRequest(s, "GET", API.getPath(s, "currentuser"))
	if err != nil {
		util.Error("GetCurrentUser", err.Error())
		return nil, err
	}

	if status != http.StatusOK {
		util.Info("[GetCurrentUser] Status Returned: ", status)
		return nil, err
	}

	teacher := &entity.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, teacher); err != nil {
		util.Error("GetCurrentUser", err.Error())
		return nil, err
	}

	// try load the user avatar from the local
	// database, if we fail  set the user avatar
	// and re-load it.
	// TODO if we fail again return some error
	// identicon and spit the error out in the logs
	avatar, ok := getUserAvatar(s, teacher.ID)
	if !ok {
		avatar, err = setUserAvatar(s, teacher.ID, teacher.Username)
		if err != nil {
			util.Error("setUserAvatar", err.Error())
			avatar = "TODO identicon fall back here"
		}
	}
	teacher.IdenticonSha512 = avatar

	return teacher, nil
}

func getUserAvatar(s *gin.Context, id uint64) (string, bool) {
	val, ok := Cache().Get(fmt.Sprintf("%d", id))
	// cache miss. no errors to report here.
	if !ok {
		return "", false
	}
	return val.(string), true
}

func setUserAvatar(s *gin.Context, id uint64, username string) (string, error) {
	input := fmt.Sprintf("%d%s", id, username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))

	avatarHash := base64.StdEncoding.EncodeToString(hmac512.Sum(nil))
	util.Verbose("caching avatar hash for student", id, username, "to", avatarHash)

	idString := fmt.Sprintf("%d", id)
	Cache().Set(idString, avatarHash, cache.DefaultExpiration)
	return avatarHash, nil
}
