package serv

import (
	"git.juddus.com/HFC/beaconing/backend/req"
	"github.com/gin-gonic/gin"
)

func registerWidgets(router *gin.Engine) {
	// ---
	// GIN WRAPPERS: Widgets
	// ---

	widgets := router.Group("/widget/")

	widgets.GET("student_overview", req.GetStudentOverview())
	widgets.GET("recent_activities", req.GetRecentActivities())
	widgets.GET("active_lesson_plans", req.GetActiveLessonPlansWidget())
}
