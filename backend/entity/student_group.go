package entity

type StudentGroupStudent struct {
	ID uint64 `json:"id"`
}

type StudentGroup struct {
	ID       uint64                 `json:"id"`
	Name     string                 `json:"name"`
	Category string                 `json:"category"`
	Students []*StudentGroupStudent `json:"student"`
}
