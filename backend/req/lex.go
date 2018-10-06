package req

import (
	"unicode"
)

type tokenType string

const (
	identifier tokenType = "identifier"
	quoted               = "quoted"
	symbol               = "sym"
	term                 = "term"
	badToken             = "bad"
	colon                = "colon"
)

type token struct {
	source     []rune
	lexeme     string
	kind       tokenType
	start, end int
}

func (t *token) String() string {
	return "{" + t.lexeme + ", " + string(t.kind) + "} "
}

func makeToken(source []rune, lexeme string, kind tokenType, start, end int) *token {
	return &token{
		source, lexeme, kind, start, end,
	}
}

type lexer struct {
	input []rune
	pos   int
}

func (l *lexer) hasNext() bool {
	return l.pos < len(l.input)
}

func (l *lexer) peek() rune {
	return l.input[l.pos]
}

func (l *lexer) consume() rune {
	c := l.input[l.pos]
	l.pos++
	return c
}

func (l *lexer) consumeWhile(pred func(rune) bool) string {
	init := l.pos
	for l.hasNext() && pred(l.peek()) {
		l.consume()
	}
	return string(l.input[init:l.pos])
}

func (l *lexer) recognizeColon() *token {
	if l.consume() != ':' {
		panic("uh oh")
	}
	return makeToken(l.input, ":", colon, l.pos-1, l.pos)
}

func (l *lexer) recognizeQuotedString() *token {
	start := l.pos

	l.consume() // "
	lexeme := l.consumeWhile(func(r rune) bool {
		return r != '"'
	})
	if l.hasNext() && l.peek() == '"' {
		l.consume() // "
	}

	end := l.pos

	return makeToken(l.input, "\""+lexeme+"\"", quoted, start, end)
}

// identifier is
// a-Z 0-9 _
// foo_Bar
// foo_bar123
// FOOBAR_foo_123 etc...
func (l *lexer) recognizeIdentifier() *token {
	start := l.pos
	lexeme := l.consumeWhile(func(r rune) bool {
		return unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_'
	})
	end := l.pos
	return makeToken(l.input, lexeme, identifier, start, end)
}

func (l *lexer) recognizeTerm() *token {
	start := l.pos
	lexeme := l.consumeWhile(func(r rune) bool {
		return !unicode.IsLetter(r) && r != '"' && r != ':'
	})
	end := l.pos

	return makeToken(l.input, lexeme, term, start, end)
}

func lexSearchQuery(input string) []*token {
	l := lexer{
		input: []rune(input),
		pos:   0,
	}

	toks := []*token{}

	for l.hasNext() {
		curr := l.peek()

		recognize := func() *token {
			switch {
			case unicode.IsLetter(curr):
				return l.recognizeIdentifier()
			case curr == ':':
				return l.recognizeColon()
			case curr == '"':
				return l.recognizeQuotedString()
			default:
				return l.recognizeTerm()
			}
		}

		if token := recognize(); token != nil {
			toks = append(toks, token)
		}
	}

	return toks
}
