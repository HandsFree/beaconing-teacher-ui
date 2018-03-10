package api

import "time"

type apiCache struct {
	// this probably isnt needed because if cacheData is
	// being invoked then it's always going to be new data
	// but we'll leave this here because I may implement it anyways
	LastCache map[string]time.Time
	Data      map[string]string
}

func newAPICache() *apiCache {
	return &apiCache{
		LastCache: map[string]time.Time{},
		Data:      map[string]string{},
	}
}

func cacheData(bucket string, data string) {
	API.cache.Data[bucket] = data
}

// Fetch checks the cache if the given value is present
// an empty string is returned if there is no value
func Fetch(bucket string) (string, bool) {
	if val, ok := API.cache.Data[bucket]; ok {
		return val, true
	}
	return "", false
}
