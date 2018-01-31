package req

// name: Algebra
// image: http://imgur.com/some_image.png
// link: http://whatever.com/algebra
type LessonPlan struct {
	Name  string `json:"name"`
	Image string `json:"image"`
	Link  string `json:"link"`
}
