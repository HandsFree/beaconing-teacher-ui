package cfg

import (
	"io/ioutil"
	"log"

	"github.com/BurntSushi/toml"
)

type tomlConfig struct {
	Title string
	Auth  authInfo
	DB    databaseInfo
}

type databaseInfo struct {
	Username string
	Password string
	Name     string
	Table    string
	SSL      bool
}

type authInfo struct {
	ID     string
	Secret string
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

	log.Println("Loading configuration file from ", filePath)

	configFileData, fileReadErr := ioutil.ReadFile(filePath)
	if fileReadErr != nil {
		log.Fatal("Failed to read file", filePath, "\n", fileReadErr.Error())
		return
	}

	if _, decodeErr := toml.Decode(string(configFileData), &Beaconing); decodeErr != nil {
		log.Fatal(decodeErr)
		return
	}
}
