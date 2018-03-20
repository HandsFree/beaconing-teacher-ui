package types

import "time"

type GLP struct {
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

type GamifiedLessonPlans struct {
	Data []GLP
}

type AssignPOST struct {
	StudentID uint64 `json:"studentId"`
	GlpID     uint64 `json:"gamifiedLessonPathId"`
}
