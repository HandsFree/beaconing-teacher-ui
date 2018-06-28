package cfg

import (
	"io/ioutil"
	"log"

	"github.com/BurntSushi/toml"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
)

type tomlConfig struct {
	Title  string
	Auth   authInfo
	DB     databaseInfo
	Server serverInfo
}

type databaseInfo struct {
	Username string `toml:"username"`
	Password string `toml:"password"`
	Name     string `toml:"name"`
	SSL      bool   `toml:"ssl"`
}

type authInfo struct {
	ID     string `toml:"id"`
	Secret string `toml:"secret"`
}

type serverInfo struct {
	Host         string `toml:"host"`
	Port         uint16 `toml:"port"`
	RootPath     string `toml:"root_path"`
	GlpFilesPath string `toml:"glp_files_path"`
}

// Beaconing is the instance of the main toml
// configuration file "cfg/config.toml". This is
// used to retrieve any of the data parsed from
// the toml config file.
var Beaconing tomlConfig

// LoadConfig loads the configuration file from
// cfg/config.toml and parses it into go structures
func LoadConfig() {
	filePath := "cfg/config.toml"

	util.Verbose("Loading configuration file from ", filePath)

	configFileData, fileReadErr := ioutil.ReadFile(filePath)
	if fileReadErr != nil {
		log.Fatal("Failed to read file ", filePath, "\n- error: ", fileReadErr.Error())
		return
	}

	if _, decodeErr := toml.Decode(string(configFileData), &Beaconing); decodeErr != nil {
		log.Fatal(decodeErr)
		return
	}
}
