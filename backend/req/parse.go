package req

import "strings"

// NOTE
// a lot of cleanups can be made here
// but it works for now.

// parser parses the tokens from the search
// query into groups that we can easily process
// .
// there are two groups:
// - search terms:
// - filter options:
// TODO.
type parser struct {
	stream []*token
	pos    int
}

func (p *parser) hasNext() bool {
	return p.pos < len(p.stream)
}

func (p *parser) peek() *token {
	return p.stream[p.pos]
}

func (p *parser) consume() *token {
	c := p.peek()
	p.pos++
	return c
}

type searchNode interface {
	String() string
}

type searchTerm struct {
	Query string
}

func (s *searchTerm) String() string {
	return "query: " + s.Query
}

// name:"value stuff here"
// <identifier> <colon> <quoted string>
type filterOption struct {
	Field string
	Value string
}

func (f *filterOption) String() string {
	return f.Field + " : " + f.Value
}

func (p *parser) parseFilterOption(field *token) *filterOption {
	// no colon
	if !p.hasNext() {
		return nil
	}

	// not a filter option just an identifier.
	if p.consume().kind != colon {
		return nil
	}

	// no value?!
	if !p.hasNext() {
		return nil
	}

	val := p.consume()

	return &filterOption{
		Field: field.lexeme,
		Value: val.lexeme,
	}
}

func (p *parser) parseSearchTerm(buff []*token) *searchTerm {
	if len(buff) == 0 {
		return nil
	}

	var query string

	// clear the buffer if necessary
	// and join them all into one search
	// query node.
	for _, t := range buff {
		query += t.lexeme
	}

	trimmed := strings.TrimSpace(query)

	// empty query. delete!
	if len(trimmed) == 0 {
		return nil
	}

	return &searchTerm{trimmed}
}

func parseTokens(toks []*token) []searchNode {
	p := parser{
		stream: toks,
		pos:    0,
	}

	nodes := []searchNode{}

	buff := []*token{}

	for p.hasNext() {
		tok := p.consume()

		if tok.kind == identifier && p.hasNext() && p.peek().kind == colon {
			opt := p.parseFilterOption(tok)
			if opt != nil {
				nodes = append(nodes, opt)
			}

			term := p.parseSearchTerm(buff[:])
			if term != nil {
				nodes = append(nodes, term)

				// clear the buff!
				buff = []*token{}
			}
		} else {
			buff = append(buff, tok)
		}
	}

	// clear buff one last time!
	if len(buff) > 0 {
		term := p.parseSearchTerm(buff[:])
		if term != nil {
			nodes = append(nodes, term)

			// clear the buff!
			buff = []*token{}
		}
	}

	return nodes
}
