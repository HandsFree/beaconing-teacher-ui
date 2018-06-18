package upload

import (
	"crypto/sha1"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"
	"unicode"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"github.com/gin-gonic/gin"
)

// legal file names are a-z, 0-9, -, _ , or .
func isLegalFileName(s string) bool {
	for _, c := range s {
		switch {
		case unicode.IsLetter(c):
			fallthrough
		case unicode.IsDigit(c):
			fallthrough
		case c == '_':
			fallthrough
		case c == '.':
			fallthrough
		case c == '-':
			break
		default:
			return false
		}
	}
	return true
}

func saveFile() {

}

// PostGLPFiles handles the post route for
// uploading _multiple_ glp files to a glp.
// this route takes an id for the glp to upload
// to
// api/v1/upload/:glp_id
func PostGLPFiles() gin.HandlerFunc {
	return func(c *gin.Context) {
		glpSha := sha1.New()
		idStr := c.Param("id")

		glpID, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			log.Println("Failed to parse id so we can't store it in the db...", err.Error())
			return
		}

		glpFolderName, err := api.GetGLPFilesFolderName(glpID)
		if len(glpFolderName) == 0 || err != nil {
			if err != nil {
				log.Println("some erorr ", err.Error())
			}

			// gen the hash since it probs. doesn't exist
			io.WriteString(glpSha, fmt.Sprintf("%s %d", idStr, time.Now().Unix()))
			glpFolderName = fmt.Sprintf("%x", glpSha.Sum(nil))

			// store it.
			if err = api.StoreGLPHash(glpID, glpFolderName); err != nil {
				log.Println("Failed to gen/store glp hashed id")
				return
			}

		}
		fmt.Println("Glp folder is ", glpFolderName)

		// --------------
		// try and create the glp folder
		// in which the files reside.
		// --------------
		base, _ := filepath.Abs(cfg.Beaconing.Server.GlpFilesPath)
		fileDirPath := filepath.Join(base, glpFolderName)

		// create the glp folder if it doesn't exist.
		if _, err := os.Stat(fileDirPath); os.IsNotExist(err) {
			err := os.MkdirAll(fileDirPath, 0700)
			if err != nil {
				c.AbortWithError(http.StatusInternalServerError, err)
				return
			}
			fmt.Println("Created folder ", fileDirPath)
		}

		form, err := c.MultipartForm()
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}
		files := form.File["files"]

		var wg sync.WaitGroup
		wg.Add(len(files))

		for _, file := range files {

			// if the file has a bad name,
			// stop the entire batch upload.
			if !isLegalFileName(file.Filename) {
				c.AbortWithError(http.StatusBadRequest, errors.New("Illegal file name "+file.Filename))
				return
			}

			// if we fail to open the file
			// stop the entire upload.
			m, err := file.Open()
			if err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}

			m.Seek(0, os.SEEK_SET)

			fileName := file.Filename
			filePath := filepath.Join(fileDirPath, fileName)
			fmt.Println("Saving to filepath", filePath)

			go func() {
				// create the file
				file, err := os.Create(filePath)
				if err != nil {
					c.AbortWithError(http.StatusInternalServerError, err)
					return
				}
				file.Chmod(0600)
				defer file.Close()

				io.Copy(file, m)

				wg.Done()
			}()
		}

		wg.Wait()

		c.Status(http.StatusOK)
	}
}
