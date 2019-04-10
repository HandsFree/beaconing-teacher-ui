package entity

// name: Algebra
// image: http://imgur.com/some_image.png
// link: http://whatever.com/algebra
type LessonPlan struct {
	ID  uint64 `json:"id"`
	GLP *GLP   `json:"glp"`
}

type LessonPlanWidget struct {
	Name string `json:"name"`
	Desc string `json:"description"`
	Link string `json:"link"`
}
