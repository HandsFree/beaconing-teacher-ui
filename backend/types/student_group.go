package types

// TODO look into if this is diff
// to the types.Student or not
// since this might be redundant having
// this structure
type StudentGroupStudent struct {
	Id uint64 `json:"id"`
}

type StudentGroup struct {
	Id       uint64                 `json:"id"`
	Name     string                 `json:"name"`
	Category string                 `json:"category"`
	Students []*StudentGroupStudent `json:"student"`
}
