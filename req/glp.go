package req

import (
	"fmt"
	"io/ioutil"
	"log"

	"git.juddus.com/HFC/beaconing/api"
	"git.juddus.com/HFC/beaconing/route"
	"git.juddus.com/HFC/beaconing/serv"
	"github.com/gin-gonic/gin"

	"net/http"
	"strconv"
)

type GLPRequest struct {
	route.SimpleManagedRoute
}

type GLPModel struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	Desc         string `json:"description"`
	Author       string `json:"author"`
	Category     string `json:"category"`
	Content      string `json:"content"`
	GamePlotID   int    `json:"gamePlotId"`
	ExternConfig string `json:"externConfig"`
}

func (r *GLPRequest) Post(s *serv.SessionContext) {

}

func (r *GLPRequest) Delete(s *serv.SessionContext) {
	// TODO sanitise
	id := s.Param("id")
	glpIDValue, err := strconv.Atoi(id)
	if err != nil || glpIDValue < 0 {
		log.Println("error when sanitising glp id", err.Error())
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

	accessToken := s.GetAccessToken()

	clnt := &http.Client{}

	req, err := http.NewRequest("DELETE", fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths/%s?access_token=%s", id, accessToken), nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	resp, err := clnt.Do(req)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Println(err.Error())
		return
	}

	s.Header("Content-Type", "application/json")
	s.JSON(http.StatusOK, gin.H{"status": string(body)})
}

func (a *GLPRequest) Get(s *serv.SessionContext) {
	glpID := s.Param("id")
	glpIDValue, err := strconv.Atoi(glpID)
	if err != nil || glpIDValue < 0 {
		s.SimpleErrorRedirect(400, "Client Error: Invalid GLP ID")
		return
	}

	minify := s.Query("minify")

	// dont minify by default, however if
	// we have a minify parameter with the value
	// 1 then we will minify this glp request.
	// NOTE: that if the parameter fails to parse, etc.
	// then it is completely ignored in the request.
	var shouldMinify bool = false
	if minify != "" {
		minifyParam, err := strconv.Atoi(minify)
		if err == nil {
			shouldMinify = minifyParam == 1
		} else {
			log.Println("Note: failed to atoi minify param in glp.go", err.Error())
		}
	}

	json, plan := api.GetGamifiedLessonPlan(s, glpIDValue)

	model := &GLPModel{
		Id:           plan.Id,
		Name:         plan.Name,
		Desc:         plan.Desc,
		Author:       plan.Author,
		Category:     plan.Category,
		GamePlotID:   plan.GamePlotId,
		ExternConfig: plan.ExternConfig,
	}
	if !shouldMinify {
		model.Content = json
	}

	s.Header("Content-Type", "application/json")
	s.Jsonify(model)
}

func NewGLPRequest(paths map[string]string) *GLPRequest {
	req := &GLPRequest{}
	req.SetPaths(paths)
	return req
}
