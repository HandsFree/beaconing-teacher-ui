package api

import (
	"os"
	"path/filepath"

	"github.com/HandsFree/beaconing-teacher-ui/backend/cfg"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
)

// DeleteGLPFile will delete the given file from the given glp
func DeleteGLPFile(glpID uint64, fileName string) error {
	util.Verbose("Deleting glp files ", fileName, " from ", glpID)

	folderName, err := GetGLPFilesFolderName(glpID)
	if err != nil {
		util.Error("No such folder for glp ", glpID)
		return err
	}

	fullPath := filepath.Join(cfg.Beaconing.Server.RootPath, cfg.Beaconing.Server.GlpFilesPath, folderName, fileName)
	if err := os.Remove(fullPath); err != nil {
		util.Error("Failed to remove file ", fullPath, "\n-", err.Error())
		return err
	}

	return nil
}

// GetGLPFilesFolderName gets the name of the folder in which the glps files are
// stored. this function will return an empty string and no
// error if the key is not in the database
func GetGLPFilesFolderName(glpID uint64) (string, error) {
	util.Verbose("Looking for glp files/folder for the glp of id ", glpID)

	query := "SELECT hash FROM glp_files WHERE glp_id = $1 LIMIT 1"
	rows, err := API.db.Query(query, glpID)
	if err != nil {
		util.Error("GetActivities", err.Error())
		return "", err
	}

	defer rows.Close()
	for rows.Next() {
		var hash []byte

		err = rows.Scan(&hash)
		if err != nil {
			util.Error("Failed to request row in getGLPFilesFolderName!", err.Error())
			continue
		}

		key := string(hash)
		util.Verbose("Found glp id for ", glpID, " its ", key)
		return key, nil
	}

	if err := rows.Err(); err != nil {
		util.Error("getGLPFilesFolderName DB Error", err.Error())
		return "", err
	}

	// wewlad
	return "", nil
}

// StoreGLPHash stores the hash in which all of the glp
// files are store under.
func StoreGLPHash(glpID uint64, key string) error {
	query := "INSERT INTO glp_files (glp_id, hash) VALUES($1, $2)"
	_, err := API.db.Exec(query, glpID, key)
	if err != nil {
		util.Error(err.Error())
		return err
	}
	util.Verbose("Stored glp hash ", key, " for glp ", glpID)
	return nil
}
