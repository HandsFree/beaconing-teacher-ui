package upload

import (
	"crypto/md5"
	"crypto/sha1"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
	"unicode"

	"git.juddus.com/HFC/beaconing/backend/api"
	"git.juddus.com/HFC/beaconing/backend/cfg"
	"github.com/gin-gonic/gin"
	imageupload "github.com/olahol/go-imageupload"
)

func PostGLPFiles() gin.HandlerFunc {
	return func(c *gin.Context) {
		req := c.Request

		glpSha := sha1.New()
		idStr := c.Param("id")

		glpId, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			log.Println("Failed to parse id so we can't store it in the db...", err.Error())
			return
		}

		glpFolderName, err := api.GetGLPFilesFolderName(glpId)
		if len(glpFolderName) == 0 || err != nil {
			if err != nil {
				log.Println("some erorr ", err.Error())
			}

			// gen the hash since it probs. doesn't exist
			io.WriteString(glpSha, fmt.Sprintf("%s %d", idStr, time.Now().Unix()))
			glpFolderName = fmt.Sprintf("%x", glpSha.Sum(nil))

			// store it.
			if err = api.StoreGLPHash(glpId, glpFolderName); err != nil {
				log.Println("Failed to gen/store glp hashed id")
				return
			}

		}
		fmt.Println("Glp folder is ", glpFolderName)

		m, header, e := req.FormFile("file")
		if e != nil {
			log.Println("oh boy ", e.Error())
			c.AbortWithError(500, e)
			return
		}

		sha := sha1.New()
		if _, err = io.Copy(sha, m); err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		m.Seek(0, os.SEEK_SET)

		// legal file names are a-z, 0-9, -, _ , or .
		isLegalFileName := func(s string) bool {
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

		fileName := header.Filename
		if !isLegalFileName(fileName) {
			c.AbortWithError(http.StatusBadRequest, errors.New("Illegal file name "+fileName))
			return
		}

		base, _ := filepath.Abs(cfg.Beaconing.Server.GlpFilesPath)
		fileDirPath := filepath.Join(base, glpFolderName)
		filePath := filepath.Join(fileDirPath, fileName)

		fmt.Println("Saving to filepath", filePath)

		// create the glp folder if it doesn't exist.
		if _, err := os.Stat(fileDirPath); os.IsNotExist(err) {
			err := os.MkdirAll(fileDirPath, 0700)
			if err != nil {
				c.AbortWithError(http.StatusInternalServerError, err)
				return
			}
			fmt.Println("Created folder ", fileDirPath)
		}

		// create the file
		file, err := os.Create(filePath)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		file.Chmod(0600)
		defer file.Close()

		// copy into
		io.Copy(file, m)

		c.Status(http.StatusOK)
	}
}

func oldPostGLPFiles() gin.HandlerFunc {
	return func(c *gin.Context) {
		img, err := imageupload.Process(c.Request, "file")
		if err != nil {
			log.Println("image upload failed ", err.Error())
			c.AbortWithError(http.StatusBadRequest, err)
		}

		imageExtension := filepath.Ext(img.Filename)
		switch imageExtension {
		case ".png":
			break
		default:
			log.Println("Illegal image type ", imageExtension)
			c.AbortWithError(500, errors.New("Illegal image type '"+imageExtension+"'"))
			return
		}

		// FIXME!
		imageSaveFolder := "./../image/"
		if dir, err := os.Stat(imageSaveFolder); dir != nil {
			if err != nil || !dir.IsDir() {
				log.Println("No such image directory", imageSaveFolder)
				c.AbortWithError(500, err)
				return
			}
		}

		// TODO handle uploading duplicate
		// images.
		// options:
		// - return an error and make the user
		// handle it, i.e. change name
		// - mangle name again or append a
		// unique identifier to it like time
		// and re-hash.
		// probably some database stuffs needed here.

		fileName := filepath.Base(img.Filename)

		log.Println("encoding file ", img.Filename)
		md5 := md5.New()
		io.WriteString(md5, fileName)

		// slap the extension on the end.
		encodedFileName := fmt.Sprintf("%x%s", md5.Sum(nil), imageExtension)
		imageSavePath := filepath.Join(imageSaveFolder, encodedFileName)

		log.Println("Saving")
		if err := img.Save(imageSavePath); err != nil {
			log.Println("image upload failed ", err.Error())
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// the file upload was a success!
		c.JSON(200, gin.H{
			"extType":  imageExtension,
			"fileName": encodedFileName,
		})
	}
}
