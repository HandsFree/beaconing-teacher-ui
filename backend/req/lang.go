package req

import (
	"github.com/gin-gonic/gin"
)

type phraseRequest struct {
	Keys []string `json:"keys,omitempty"`
}

func GetPhrases() gin.HandlerFunc {
	return func (c *gin.Context) {
		langCode := c.Param("code")

		var phrase phraseRequest
		phraseKeys := c.BindJSON(&phrase)		

		var wg sync.WaitGroup
		wg.Add(len(phraseKeys.Keys))

		for _, phrase := range phraseKeys.Keys {
			go func() {
				GetPhrase()(c)
				defer wg.Done()
			}()
		}

		wg.Wait()
	}
}

// move me into the API
func GetPhrase() gin.HandlerFunc {
	return func(c *gin.Context) {
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
	}
}
