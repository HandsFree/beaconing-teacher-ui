package paths

type PathType uint

// TODO
const (
	GET PathType = iota
	POST
	DELETE
	PUT
)

type Path struct {
	Kind  PathType
	Value string
}

func Get(val string) Path {
	return Path{GET, val}
}
func Post(val string) Path {
	return Path{POST, val}
}
func Delete(val string) Path {
	return Path{DELETE, val}
}
func New(kind PathType, val string) Path {
	return Path{kind, val}
}

type PathSet []Path

func Empty() PathSet {
	return PathSet{}
}
