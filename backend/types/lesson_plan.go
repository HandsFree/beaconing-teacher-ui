package types

// name: Algebra
// image: http://imgur.com/some_image.png
// link: http://whatever.com/algebra
type LessonPlan struct {
	ID  uint64              `json:"id"`
	GLP *GamifiedLessonPlan `json:"glp"`
}
