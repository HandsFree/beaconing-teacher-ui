package cfg

import (
	"bufio"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/HandsFree/beaconing-teacher-ui/backend/util"
	jsoniter "github.com/json-iterator/go"
)

type tomlConfig struct {
	Title        string
	Auth         authInfo
	Localisation localisationInfo
	DB           databaseInfo
	Server       serverInfo
	Debug        debugInfo
}

type localisationInfo struct {
	KeyFile string `toml:"key_file"`
	MapFile string `toml:"map_file"`
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

type debugInfo struct {
	Grmon bool `toml:"grmon"`
}

// Beaconing is the instance of the main toml
// configuration file "cfg/config.toml". This is
// used to retrieve any of the data parsed from
// the toml config file.
var Beaconing tomlConfig

// maybe some type aliasing is due here!
var Translations map[string]map[string]string
var TranslationKeys map[string]string

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

	TranslationKeys = LoadTranslationKeys()
	Translations = LoadTranslations()
}

func LoadTranslations() map[string]map[string]string {
	mapFile := Beaconing.Localisation.MapFile

	data, err := ioutil.ReadFile(mapFile)
	if err != nil {
		panic(err)
	}

	var result map[string]map[string]string
	if err := jsoniter.Unmarshal(data, &result); err != nil {
		panic(err)
	}

	return result
}

func LoadTranslationKeys() map[string]string {
	keyFile := Beaconing.Localisation.KeyFile

	file, err := os.Open(keyFile)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	result := map[string]string{}

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		cols := strings.Split(line, "=>")
		key, english := cols[0], cols[1]
		result[english] = key
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return result
}
