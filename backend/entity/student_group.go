package entity

// StudentGroupStudent ...
// TODO look into if this is diff
// to the entity.Student or not
// since this might be redundant having
// this structure
type StudentGroupStudent struct {
	ID uint64 `json:"id"`
}

// StudentGroup ...
type StudentGroup struct {
	ID       uint64                 `json:"id"`
	Name     string                 `json:"name"`
	Category string                 `json:"category"`
	Students []*StudentGroupStudent `json:"student"`
}
