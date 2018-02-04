package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	jsoniter "github.com/json-iterator/go"
	"io/ioutil"
	"log"
	"net/http"

	"git.juddus.com/HFC/beaconing/serv"
	"git.juddus.com/HFC/beaconing/types"
)

// this is an api helper thing which will return
// json objects as well as the raw json strings

var Api *ApiHelper = NewApiHelper()

type ApiHelper struct {
	APIPath string
}

func (a *ApiHelper) getPath(accessToken string, args ...string) string {
	path := a.APIPath
	for _, arg := range args {
		path += arg
	}
	return fmt.Sprintf("%s?access_token=%s", path, accessToken)
}

// TODO: filter the useless stuff out of
// the glp json
func GetGamifiedLessonPlan(s *serv.SessionContext, id int) (string, *types.GamifiedLessonPlan) {
	accessToken := s.GetAccessToken()

	response, err := http.Get(Api.getPath(accessToken, "gamifiedlessonpaths/", fmt.Sprintf("%d", id)))
	if err != nil {
		log.Fatal(err)
		return "", nil
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
		return "", nil
	}

	data := &types.GamifiedLessonPlan{}
	if err := jsoniter.Unmarshal(body, data); err != nil {
		log.Println(err)
	}

	// should we compact everything?
	// we do here because the json for glps request is stupidly long
	buffer := new(bytes.Buffer)
	if err := json.Compact(buffer, body); err != nil {
		log.Println(err)
	}

	return buffer.String(), data
}

func NewApiHelper() *ApiHelper {
	// TODO: we can store this in the toml config
	return &ApiHelper{
		APIPath: "https://core.beaconing.eu/api/",
	}
}
