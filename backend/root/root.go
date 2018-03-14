package root

import (
	"net/http"

	"git.juddus.com/HFC/beaconing/backend/page"
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
