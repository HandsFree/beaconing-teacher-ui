package json

// name: Algebra
// image: http://imgur.com/some_image.png
// link: http://whatever.com/algebra
type LessonPlan struct {
	Name string `json:"name"`
	Src  string `json:"src"`
	Link string `json:"link"`
}
