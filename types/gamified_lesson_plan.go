package types

type GamifiedLessonPlan struct {
	Id           int
	Name         string
	Desc         string
	Author       string
	Category     string
	Content      string
	GamePlotId   int
	ExternConfig string
}
