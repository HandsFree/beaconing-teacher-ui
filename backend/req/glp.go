package req

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"gopkg.in/h2non/filetype.v1"

	"github.com/HandsFree/beaconing-teacher-ui/backend/api"
	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"

	"net/http"
	"strconv"
)

type GLPModel struct {
	Id           uint64 `json:"id"`
	Name         string `json:"name"`
	Desc         string `json:"description"`
	Author       string `json:"author"`
	Category     string `json:"category"`
	Content      string `json:"content"`
	GamePlotID   uint64 `json:"gamePlotId"`
	ExternConfig string `json:"externConfig"`
}

func PostGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		resp, err := api.CreateGLP(s)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(resp))
	}
}

// deletes the given glp
//
// inputs:
// - glp id
func DeleteGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			log.Println("error when sanitising glp id", err.Error())
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		body, err := api.DeleteGLP(s, id)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(body))
	}
}

type glpFile struct {
	Name string `json:"name"`
	Size int64  `json:"size"`
	Mime string `json:"mime"`
	Link string `json:"link"`
}

func loadGLPFiles(folderName string) []glpFile {
	base, _ := filepath.Abs(filepath.Join(cfg.Beaconing.Server.RootPath, cfg.Beaconing.Server.GlpFilesPath))

	path := filepath.Join(base, folderName)

	log.Println("Loading glp files from ", path)

	fileList := []glpFile{}
	fileInfo, err := ioutil.ReadDir(path)
	if err != nil {
		log.Println("Failed to walk dir ", path, " because ", err.Error())
		return []glpFile{}
	}

	for _, fileInfo := range fileInfo {
		fullPath := filepath.Join(cfg.Beaconing.Server.RootPath, cfg.Beaconing.Server.GlpFilesPath, folderName, fileInfo.Name())

		file, err := os.Open(fullPath)
		if err != nil {
			log.Println(err.Error())
			continue
		}
		defer file.Close()

		fstPart := make([]byte, 1024)
		_, err = file.Read(fstPart)
		if err != nil {
			log.Println(err.Error())
			continue
		}
		file.Seek(0, os.SEEK_SET)

		fileType := ""

		absPath := filepath.Join(cfg.Beaconing.Server.GlpFilesPath, folderName, fileInfo.Name())

		kind, unknown := filetype.Match(fstPart)
		if unknown != nil {
			log.Println("Unknown file type for file ", fullPath)
			// mime std. says not to send
			// mime type for unknown files
			fileType = ""
		} else {
			fileType = kind.MIME.Value
		}

		glpFile := glpFile{
			Name: fileInfo.Name(),
			Size: fileInfo.Size(),
			Mime: fileType,
			Link: absPath,
		}

		fileList = append(fileList, glpFile)
	}

	return fileList
}

func GetGLPFilesRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		folderPath, err := api.GetGLPFilesFolderName(id)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		files := loadGLPFiles(folderPath)

		filesJSON, err := jsoniter.Marshal(files)
		if err != nil {
			s.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(filesJSON))
	}
}

// retrieves the given glp
//
// inputs:
// - glp id
// - minify (bool, optional)
//   whether the "contents" of the GLP is omitted or not
func GetGLPRequest() gin.HandlerFunc {
	return func(s *gin.Context) {
		idParam := s.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 64)
		if err != nil || id < 0 {
			s.String(http.StatusBadRequest, "Client Error: Invalid GLP ID")
			return
		}

		minify := s.Query("minify")

		// dont minify by default, however if
		// we have a minify parameter with the value
		// 1 then we will minify this glp request.
		// NOTE: that if the parameter fails to parse, etc.
		// then it is completely ignored in the request.
		shouldMinify := false
		if minify != "" {
			minifyParam, errConv := strconv.Atoi(minify)
			if errConv == nil {
				shouldMinify = minifyParam == 1
			} else {
				log.Println("Note: failed to atoi minify param in glp.go", err.Error())
			}
		}

		plan, err := api.GetGLP(s, id, shouldMinify)
		if err != nil {
			s.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// log.Println("GLP Testing!")
		// log.Println("-", plan.Analytics)
		// log.Println("-", plan.Analytics.ActivityID)
		// log.Println("-", plan.Analytics.Json.Analytics.TrackingCode)
		// log.Println("-", plan.Analytics.Json.Analytics.Dashboard)

		planJSON, err := jsoniter.Marshal(plan)
		if err != nil {
			log.Println(err.Error())
			return
		}

		s.Header("Content-Type", "application/json")
		s.String(http.StatusOK, string(planJSON))
	}
}
