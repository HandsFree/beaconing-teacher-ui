package serv

import (
	"log"
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/req"
	"github.com/gin-gonic/gin"
)

func registerAPI(router *gin.Engine) {
	// ---
	// GIN WRAPPERS: API
	// ---

	v1 := router.Group("/api/v1/")

	lang := v1.Group("lang")
	{
		// FIXME move into a handler func.
		lang.GET("/:code/phrase/:key", func(c *gin.Context) {
			langCode := c.Param("code")
			phraseKey := c.Param("key")

			transSet, ok := cfg.Translations[phraseKey]
			if !ok {
				log.Println("warning: translation SET not found for", phraseKey)
				c.JSON(http.StatusOK, map[string]string{
					"translation": "Translation not found!",
				})
				return
			}

			translation, ok := transSet[langCode]
			if !ok {
				log.Println("warning: phrase translation not found for", phraseKey, "language is", langCode)
				c.JSON(http.StatusOK, map[string]string{
					"translation": "Translation not found!",
				})
				return
			}

			c.JSON(http.StatusOK, map[string]string{
				"translation": translation,
			})
		})

		// IMPLEMENT
		// ask for various phrases
		lang.POST("/phrase/", func(c *gin.Context) {
			// TODO!
		})
	}

	// FIXME(Felix): this probably falls under some kind of
	// category. activity/activities?
	{
		v1.GET("recent_activities", req.GetRecentActivities())

		// FIXME: move somewhere, e.g. /students/
		v1.GET("student_overview", req.GetStudentOverview())
	}

	authAPI := v1.Group("auth")
	{
		authAPI.GET("gettoken", req.GetCheckAuthRequest())
	}

	tokens := v1.Group("token")
	{
		tokens.GET("/", req.GetTokenRequest())
	}

	assign := v1.Group("assign")
	{
		assign.GET("/:student/to/:glp", req.GetAssignRequest())
	}

	assignGroup := v1.Group("assigngroup")
	{
		assignGroup.GET("/:group/to/:glp", req.GetGroupAssignRequest())
	}

	student := v1.Group("student")
	{
		student.GET("/:id", req.GetStudentRequest())
		student.PUT("/:id", req.PutStudentRequest())
		student.DELETE("/:id", req.DeleteStudentRequest())
		student.POST("/", req.PostStudentRequest())

		// kind of like assignedglps, but a HARD search i.e.
		// it will go through each GLP and get the GLPs. this is predominently
		// for the calendar since this is what happens on the client side, but i want
		// to squish it into one request to make it a bit faster.
		student.GET("/:id/assignedglps_hard", req.GetAssignedGLPsHardRequest())

		student.GET("/:id/assignedglps", req.GetAssignedGLPsRequest())
		student.DELETE("/:id/assignedglps/:glp", req.DeleteAssignedGLPsRequest())
	}

	students := v1.Group("students")
	{
		students.GET("/", req.GetStudentsRequest())

		// FIXME(Felix): _hard request here. this is mirrored?
		students.GET("/:id/assignedglps", req.GetAssignedGLPsRequest())

		students.DELETE("/:id/assignedglps/:glp", req.DeleteAssignedGLPsRequest())
	}

	profile := v1.Group("profile")
	{
		profile.GET("/", req.GetProfileRequest())
		profile.PUT("/", req.PutProfileRequest())
	}

	glps := v1.Group("glps")
	{
		glps.GET("/", req.GetGLPSRequest())
	}

	glp := v1.Group("glp")
	{
		glp.GET("/:id", req.GetGLPRequest())
		glp.GET("/:id/files/", req.GetGLPFilesRequest())

		glp.DELETE("/:id", req.DeleteGLPRequest())
		glp.POST("/", req.PostGLPRequest())
		glp.PUT("/:id", req.PutGLPRequest())
	}

	studentGroups := v1.Group("studentgroups")
	{
		studentGroups.GET("/", req.GetStudentGroupsRequest())
	}

	studentsFromStudentGroup := v1.Group("students_from_studentgroup")
	{
		studentsFromStudentGroup.GET("/:id", req.GetStudentsFromStudentGroupRequest())
	}

	studentGroup := v1.Group("studentgroup")
	{
		studentGroup.GET("/:id", req.GetStudentGroupRequest())
		studentGroup.PUT("/:id", req.PutStudentGroupRequest())

		studentGroup.GET("/:id/assignedglps_hard", req.GetStudentGroupAssignedHardRequest())
		studentGroup.GET("/:id/assignedglps", req.GetStudentGroupAssignedRequest())

		studentGroup.DELETE("/:id/assignedglps/:glp", req.DeleteGroupAssignedRequest())
		studentGroup.POST("/", req.PostStudentGroupRequest())
		studentGroup.DELETE("/:id", req.DeleteStudentGroupRequest())
	}

	gameplots := v1.Group("gameplots")
	{
		gameplots.GET("/", req.GetGameplots())
	}

	v1.POST("search", req.PostSearchRequest())
}
