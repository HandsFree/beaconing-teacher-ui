package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type apiService interface {
	getPath(s *gin.Context, args ...string) string
	getBasePath() string
	getCache() *apiCache
	getDB() *sql.DB
}

// SimpleAPI is a container around a database
// instance, an apiCache (unused for now) and
// a path. It contains convenience functions for
// api path manipulation
type SimpleAPI struct {
	APIPath string
	cache   *apiCache
	db      *sql.DB
}

// New creates a new instance of a simple
// api from the given api path
func New(path string) SimpleAPI {
	return SimpleAPI{
		path, nil, nil,
	}
}
