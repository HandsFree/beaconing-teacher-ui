package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Page functions have similar code, would be nice to have one function for all of them
func handleRoot(c *gin.Context) {
	_, keyDefined := tokenDetails.Get("code")
	if keyDefined {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"pageTitle":  "Beaconing | Home",
			"pageScript": "dist/beaconing/pages/home/index.js",
		})
	} else {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
	}
}

func handleLessonManager(c *gin.Context) {
	_, keyDefined := tokenDetails.Get("code")
	if keyDefined {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"pageTitle":  "Beaconing | Lesson Manager",
			"pageScript": "dist/beaconing/pages/lesson_manager/index.js",
		})
	} else {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
	}
}

func handleToken(c *gin.Context) {
	if code := c.Query("code"); code != "" {
		tokenDetails.Set("code", code)
		// fmt.Println(DB["code"])
		getToken()
		c.Redirect(http.StatusTemporaryRedirect, "/")
	}
}

func handleStudents(c *gin.Context) {
	accessToken, keyDefined := tokenDetails.Get("access_token")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/students?access_token=%s", accessToken))
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

	strJSON := string(body)

	c.Header("Content-Type", "application/json")
	c.String(http.StatusOK, strJSON)
}

func handleStudent(c *gin.Context) {
	studentID := c.Param("id")
	action := c.Param("action")

	fmt.Println(action)

	accessToken, keyDefined := tokenDetails.Get("access_token")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
		return
	}

	var strJSON string

	switch action {
	case "/glps", "/glps/":
		response, err := getStudentGLPS(studentID, accessToken)
		if err != nil {
			log.Fatal(err)
			return
		}
		strJSON = response
	default:
		response, err := getStudent(studentID, accessToken)
		if err != nil {
			log.Fatal(err)
			return
		}
		strJSON = response
	}

	c.Header("Content-Type", "application/json")
	c.String(http.StatusOK, strJSON)
}

func handleGLPs(c *gin.Context) {
	accessToken, keyDefined := tokenDetails.Get("access_token")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths?access_token=%s", accessToken))
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

	strJSON := string(body)

	c.Header("Content-Type", "application/json")
	c.String(http.StatusOK, strJSON)
}

func handleGLP(c *gin.Context) {
	// Needs filtering
	glpID := c.Param("id")

	accessToken, keyDefined := tokenDetails.Get("access_token")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
		return
	}

	response, err := http.Get(fmt.Sprintf("https://core.beaconing.eu/api/gamifiedlessonpaths/%s?access_token=%s", glpID, accessToken))
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

	strJSON := string(body)

	c.Header("Content-Type", "application/json")
	c.String(http.StatusOK, strJSON)
}

func handleAssign(c *gin.Context) {
	studentID := c.Param("student")
	glpID := c.Param("glp")

	accessToken, keyDefined := tokenDetails.Get("access_token")
	if !keyDefined {
		c.Redirect(http.StatusTemporaryRedirect, authLink)
		return
	}

	strJSON, err := assignGLP(studentID, glpID, accessToken)
	if err != nil {
		log.Fatal(err)
		return
	}

	c.Header("Content-Type", "application/json")
	c.String(http.StatusOK, strJSON)
}
