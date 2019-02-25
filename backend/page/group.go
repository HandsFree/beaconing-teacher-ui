package page

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetGroup(p *Page) gin.HandlerFunc {
	handler := func(c *gin.Context) {
		c.HTML(http.StatusOK, p.Template, &gin.H{
			"pageTitle":  p.Title,
			"pageScript": p.Script,
			"host":       p.Host,
		})
	}
	return gin.HandlerFunc(handler)
}