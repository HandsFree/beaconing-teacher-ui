package cfg

import (
	"io/ioutil"
	"log"

	"github.com/BurntSushi/toml"
)

type tomlConfig struct {
	Title string
	Auth  authInfo
}

type authInfo struct {
	ID     string
	Secret string
}

var Beaconing tomlConfig

func LoadConfig() {
	filePath := "cfg/config.toml"

	configFileData, fileReadErr := ioutil.ReadFile(filePath)
	if fileReadErr != nil {
		log.Fatal("Failed to read file", filePath, "\n", fileReadErr.Error())
		return
	}

	if _, decodeErr := toml.Decode(string(configFileData), &Beaconing); decodeErr != nil {
		log.Fatal(decodeErr)
		return
	}
	log.Printf("Loaded configuration file from: '%s'", filePath)
}
