package req

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/hands-free/beaconing-teacher-ui/backend/cfg"
)

type phraseRequest struct {
	Keys         []string `json:"keys"`
	LanguageCode string   `json:"language_code"`
}

func loadPhraseFromTranslationFile(langCode, phraseKey string) (string, bool) {
	transSet, ok := cfg.Translations[phraseKey]
	if !ok {
		log.Println("warning: translation SET not found for", phraseKey)
		return "", false
	}

	translation, ok := transSet[langCode]
	if !ok {
		log.Println("warning: phrase translation not found for", phraseKey, "language is", langCode)
		return "", false
	}

	return translation, true
}

func loadPhrasesFromTranslationFile(langCode string, phrases ...string) []string {
	var wg sync.WaitGroup
	wg.Add(len(phrases))

	queue := make(chan string, 1)

	for _, p := range phrases {
		go func() {
			key, ok := loadPhraseFromTranslationFile(p, langCode)
			if ok {
				queue <- key
			}
		}()
	}

	results := []string{}
	go func() {
		for k := range queue {
			results = append(results, k)
			wg.Done()
		}
	}()

	wg.Wait()
	return results
}

func GetTranslationPhrases() gin.HandlerFunc {
	return func(c *gin.Context) {
		var phrase phraseRequest
		if err := c.BindJSON(&phrase); err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		phrases := loadPhrasesFromTranslationFile(phrase.LanguageCode, phrase.Keys...)

		c.JSON(http.StatusOK, map[string][]string{
			"translation_set": phrases,
		})
	}
}

func GetTranslation() gin.HandlerFunc {
	return func(c *gin.Context) {
		langCode := c.Param("code")
		phraseKey := c.Param("key")

		translation, ok := loadPhraseFromTranslationFile(langCode, phraseKey)
		if !ok {
			c.JSON(http.StatusOK, map[string]string{
				"translation": "Translation not found!",
			})
			return
		}

		c.JSON(http.StatusOK, map[string]string{
			"translation": translation,
		})
	}
}
