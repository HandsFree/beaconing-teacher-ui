package img

import (
	"crypto/md5"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	imageupload "github.com/olahol/go-imageupload"
)

func handleServe(c *gin.Context) {

}

// TODO store this in the database
// just an id, and the path? store the old filename too?
// also allow for jpeg and jpg.
func handleUpload(c *gin.Context) {
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

func ImageUploadServerHandle() *gin.Engine {
	r := gin.Default()
	gin.SetMode(gin.DebugMode)

	if gin.IsDebugging() {
		// uploading route for testing
		r.GET("/", func(c *gin.Context) {
			c.File("./img/index.html")
		})
	}

	r.Static("/img", "../image/")

	r.POST("/upload", handleUpload)
	return r
}
