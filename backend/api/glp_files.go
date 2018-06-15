package api

import "log"

// gets the name of the folder in which the glps files are
// stored. this function will return an empty string and no
// error if the key is not in the database
func GetGLPFilesFolderName(glpID uint64) (string, error) {
	log.Println("Looking for glp files/folder for the glp of id ", glpID)

	query := "SELECT hash FROM glp_files WHERE glp_id = $1 LIMIT 1"
	rows, err := API.db.Query(query, glpID)
	if err != nil {
		log.Println("GetActivities", err.Error())
		return "", err
	}

	defer rows.Close()
	for rows.Next() {
		var hash []byte

		err = rows.Scan(&hash)
		if err != nil {
			log.Println("-- Failed to request row in getGLPFilesFolderName!", err.Error())
			continue
		}

		key := string(hash)
		log.Println("- Found glp id for ", glpID, " its ", key)
		return key, nil
	}

	if err := rows.Err(); err != nil {
		log.Println("getGLPFilesFolderName DB Error", err.Error())
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
		log.Println("-- ", err.Error())
		return err
	}
	log.Println("Stored glp hash ", key, " for glp ", glpID)
	return nil
}
