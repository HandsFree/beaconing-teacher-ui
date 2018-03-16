package types

import "time"

type GamifiedLessonPlan struct {
	ID           uint64    `json:"id"`
	Name         string    `json:"name"`
	Desc         string    `json:"description"`
	Author       string    `json:"author"`
	Category     string    `json:"category"`
	Public       bool      `json:"public"`
	GamePlotID   uint64    `json:"gamePlotId"`
	UpdatedAt    time.Time `json:"updatedAt"`
	Owner        string    `json:"owner"`
	OwnedByMe    bool      `json:"ownedByMe"`
	ReadOnly     bool      `json:"readOnly"`
	Content      string    `json:"content"`
	ExternConfig string    `json:"externConfig"`
}
