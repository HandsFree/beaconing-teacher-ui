package authoring_tool

import (
	"net/http"

	"github.com/HandsFree/beaconing-teacher-ui/backend/page"
	"github.com/gin-gonic/gin"
)

func Get(p *page.Page) gin.HandlerFunc {
	handler := func(c *gin.Context) {
		c.HTML(http.StatusOK, p.Template, &gin.H{
			"pageTitle":  p.Title,
			"pageScript": p.Script,
			"host":       p.Host,
		})
	}
	return gin.HandlerFunc(handler)
}
