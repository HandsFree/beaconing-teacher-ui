package types

import "time"

type AnalyticsData struct {
	Json struct {
		Analytics struct {
			Limits struct {
				MaxTime     string `json:"maxTime"`
				MaxAttempts int    `json:"maxAttempts"`
			} `json:"limits"`

			// .. etc
			TrackingCode string `json:"trackingCode"`
			ActivityID   string `json:"activityId"`
			Dashboard    string `json:"dashboard"`
		} `json:"analytics"`
	} `json:"json"`
	Level      int    `json:"level"`
	ActivityID string `json:"activityId"`
}

type GLP struct {
	ID                 uint64        `json:"id"`
	Name               string        `json:"name"`
	Desc               string        `json:"description"`
	Author             string        `json:"author"`
	Category           string        `json:"category"`
	Domain             string        `json:"domain"`
	Topic              string        `json:"topic"`
	AgeGroup           string        `json:"ageGroup"`
	Year               int           `json:"year"`
	LearningObjectives []string      `json:"learningObjectives"`
	Competences        []string      `json:"competences"`
	Public             bool          `json:"public"`
	GamePlotID         uint64        `json:"gamePlotId"`
	UpdatedAt          time.Time     `json:"updatedAt"`
	CreatedAt          time.Time     `json:"createdAt"`
	Owner              string        `json:"owner"`
	OwnedByMe          bool          `json:"ownedByMe"`
	ReadOnly           bool          `json:"readOnly"`
	Content            string        `json:"content"`
	ExternConfig       string        `json:"externConfig"`
	PlayURL            string        `json:"playUrl"`
	Analytics          AnalyticsData `json:"analytics"`
}

type GamifiedLessonPlans struct {
	Data []GLP
}

type AssignPOST struct {
	StudentID uint64 `json:"studentId"`
	GlpID     uint64 `json:"gamifiedLessonPathId"`
}

type AssignGroupPOST struct {
	GroupID uint64 `json:"studentGroupId"`
	GlpID   uint64 `json:"gamifiedLessonPathId"`
}
