package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

// TODO

type apiService interface {
	getPath(s *gin.Context, args ...string) string
	getBasePath() string
	getCache() *apiCache
	getDB() *sql.DB
}

type SimpleAPI struct {
	APIPath string
	cache   *apiCache
	db      *sql.DB
}

func New(path string) SimpleAPI {
	return SimpleAPI{
		path, nil, nil,
	}
}
