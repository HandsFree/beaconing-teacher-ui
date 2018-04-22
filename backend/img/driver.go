package img

import "log"

func main() {
	log.Println("... Running from image host directly")
	router := ImageUploadServerHandle()
	router.Run(":5000")
}
