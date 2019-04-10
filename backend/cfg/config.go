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
	Server       serverInfo
	Debug        debugInfo
}

type localisationInfo struct {
	KeyFile string `toml:"key_file"`
	MapFile string `toml:"map_file"`
}

type authInfo struct {
	ID     string `toml:"id"`
	Secret string `toml:"secret"`
}

type serverInfo struct {
	Local             bool   `toml:"local"`
	Host              string `toml:"host"`
	Port              uint16 `toml:"port"`
	RootPath          string `toml:"root_path"`
	GlpFilesPath      string `toml:"glp_files_path"`
	BeaconingAPIRoute string `toml:"beaconing_api_route"`
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
	filePath := "./cfg/config.toml"

	util.Verbose("Loading configuration file from ", filePath)

	// read the file
	configFileData, fileReadErr := ioutil.ReadFile(filePath)
	if fileReadErr != nil {
		log.Fatal("Failed to read file ", filePath, "\n- error: ", fileReadErr.Error())
		return
	}

	// decode this file as toml, any problems with the
	// toml code will be caught here.
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

	// here we read the translation keys
	// with a scanner, processing it line by line
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()

		// a translation key looks like this
		// key => val
		// so we can simply split like so
		cols := strings.Split(line, "=>")

		// if there aren't two values then
		// the mapping on this line is malformed.
		if len(cols) != 2 {
			log.Fatal("Malformed trans key file, specifically this line:\n\t", line)
			continue
		}

		key, english := cols[0], cols[1]
		result[english] = key
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return result
}
