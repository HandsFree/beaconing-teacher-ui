package types

type GamifiedLessonPlan struct {
	Id           uint64
	Name         string
	Desc         string
	Author       string
	Category     string
	GamePlotId   uint64
	ExternConfig string
}
