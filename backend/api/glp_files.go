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
