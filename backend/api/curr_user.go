package api

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"

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
		return nil, nil
	}

	teacher := &entity.CurrentUser{}
	if err := jsoniter.Unmarshal(resp, teacher); err != nil {
		util.Error("GetCurrentUser", err.Error())
		return nil, err
	}

	// TODO probably some caching can be done here.

	// try load the user avatar from the local
	// database, if we fail  set the user avatar
	// and re-load it.
	// TODO if we fail again return some error
	// identicon and spit the error out in the logs
	avatar, err := getUserAvatar(s, teacher.ID)
	if err != nil {
		util.Error("getUserAvatar", err.Error())

		avatar, err = setUserAvatar(s, teacher.ID, teacher.Username)
		if err != nil {
			util.Error("setUserAvatar", err.Error())
			avatar = "TODO identicon fall back here"
		}
	}
	teacher.IdenticonSha512 = avatar

	return teacher, nil
}

func getUserAvatar(s *gin.Context, id uint64) (string, error) {
	query := "SELECT avatar_blob FROM student_avatar WHERE student_id = $1"
	rows, err := API.db.Query(query, id)
	if err != nil {
		util.Error(err.Error())
		return "", err
	}

	defer rows.Close()
	for rows.Next() {
		var avatarHash []byte

		err = rows.Scan(&avatarHash)
		if err != nil {
			util.Error("Failed to request row in avatar_blob query!", err.Error())
			continue
		}

		return string(avatarHash), nil
	}

	if err := rows.Err(); err != nil {
		util.Error("getUserAvatar DB Error", err.Error())
		return "", err
	}

	return "", errors.New("Failed to get avatar_blob of user")
}

func setUserAvatar(s *gin.Context, id uint64, username string) (string, error) {
	if API.db == nil {
		util.Error("No database connection has been established")
		return "", errors.New("No database connection")
	}

	input := fmt.Sprintf("%d%s", id, username)
	hmac512 := hmac.New(sha512.New, []byte("what should the secret be!"))
	hmac512.Write([]byte(input))

	avatarHash := base64.StdEncoding.EncodeToString(hmac512.Sum(nil))
	util.Verbose("Setting avatar hash for student ", id, username, " to ", avatarHash)

	query := "INSERT INTO student_avatar (student_id, avatar_blob) VALUES($1, $2)"
	_, err := API.db.Exec(query, id, avatarHash)
	if err != nil {
		util.Error(err.Error())
		return "", err
	}

	return avatarHash, nil
}
