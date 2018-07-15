package upload

import (
	"crypto/sha1"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"
	"unicode"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
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

func DeleteGLPFile() gin.HandlerFunc {
	type deleteGLPFiles struct {
		ID    uint64   `json:"id"`
		Files []string `json:"files"`
	}

	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			util.Error("DeleteGLPFile", err.Error())
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		fileName := c.Param("file")
		if !isLegalFileName(fileName) {
			util.Error("DeleteGLPFile", "Bad file name")
			c.AbortWithError(http.StatusBadRequest, errors.New("Bad file name"))
			return
		}

		if err := api.DeleteGLPFile(id, fileName); err != nil {
			util.Error("DeleteGLPFile", err.Error())
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		c.Status(http.StatusOK)
	}
}

// PostGLPFiles handles the post route for
// uploading _multiple_ glp files to a glp.
// this route takes an id for the glp to upload
// to
// api/v1/upload/:glp_id
func PostGLPFiles() gin.HandlerFunc {
	return func(c *gin.Context) {
		glpSha := sha1.New()
		idParam := c.Param("id")

		glpID, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil {
			util.Error("Failed to parse id so we can't store it in the db...", err.Error())
			return
		}

		glpFolderName, err := api.GetGLPFilesFolderName(glpID)
		if len(glpFolderName) == 0 || err != nil {
			if err != nil {
				util.Error("some erorr ", err.Error())
			}

			// gen the hash since it probs. doesn't exist
			io.WriteString(glpSha, fmt.Sprintf("%s %d", idParam, time.Now().Unix()))
			glpFolderName = fmt.Sprintf("%x", glpSha.Sum(nil))

			// store it.
			if err = api.StoreGLPHash(glpID, glpFolderName); err != nil {
				util.Error("Failed to gen/store glp hashed id")
				return
			}

		}
		fmt.Println("Glp folder is ", glpFolderName)

		// --------------
		// try and create the glp folder
		// in which the files reside.
		// --------------
		base, _ := filepath.Abs(filepath.Join(cfg.Beaconing.Server.RootPath, cfg.Beaconing.Server.GlpFilesPath))
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
