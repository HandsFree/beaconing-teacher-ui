package auth

import "sync"

// TokenDatabase is a struct with embedded mutex for the
// database which contains the token details
type TokenDatabase struct {
	sync.Mutex
	DB map[string]string
}

// Set adds or changes an entry
func (tdb *TokenDatabase) Set(key string, value string) {
	tdb.Lock()
	tdb.DB[key] = value
	tdb.Unlock()
}

// Get obtains an entry
func (tdb *TokenDatabase) Get(key string) (string, bool) {
	tdb.Lock()
	value, defined := tdb.DB[key]
	defer tdb.Unlock()
	return value, defined
}
