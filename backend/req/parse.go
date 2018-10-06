package req

import "fmt"

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
	Token *token
}

func newSearchTerm(tok *token) *searchTerm {
	return &searchTerm{
		Token: tok,
	}
}

func (s *searchTerm) String() string {
	return "term: " + s.Token.lexeme
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
	// end of input so lets leave this function
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

func parseTokens(toks []*token) []searchNode {
	p := parser{
		stream: toks,
		pos:    0,
	}

	nodes := []searchNode{}

	for p.hasNext() {
		tok := p.consume()

		if p.hasNext() && tok.kind == identifier && p.peek().kind == colon {
			opt := p.parseFilterOption(tok)
			if opt != nil {
				nodes = append(nodes, opt)
			}
		} else {
			term := newSearchTerm(tok)
			nodes = append(nodes, term)
		}
	}

	// we have all the nodes but now we need
	// to optimise them and join the individual
	// search term nodes into one big search term.

	finalTerms := [][]int{}
	termsList := []int{}

	for i := 0; i < len(nodes); i++ {
		if term := nodes[i].(*searchTerm); term != nil {
			termsList = append(termsList, i)
		} else {
			finalTerms = append(finalTerms, termsList)
			termsList = []int{}
		}
	}

	newNodes := []searchNode{}

	for _, termList := range finalTerms {
		fst := nodes[termList[0]].(*searchTerm)
		lst := nodes[len(termList)-1].(*searchTerm)

		source := fst.Token.source

		start := fst.Token.start
		end := lst.Token.end

		query := string(source[start:end])
		fmt.Println("query is ", query)

		newNodes = append(newNodes, nil)
	}

	fmt.Println("printing nodes:")
	fmt.Println("-")
	for _, node := range nodes {
		fmt.Println(node)
	}
	fmt.Println("-")
	fmt.Println("-")

	return nodes
}
