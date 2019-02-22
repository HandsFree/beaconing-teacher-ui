package serv

import (
	"github.com/HandsFree/beaconing-teacher-ui/backend/req"
	"github.com/gin-gonic/gin"
)

func registerWidgets(router *gin.Engine) {
	// ---
	// GIN WRAPPERS: Widgets
	// ---

	widgets := router.Group("/widget/")

	// TODO(Felix): Remove me!
	widgets.GET("active_lesson_plans", req.GetActiveLessonPlansWidget())
}
