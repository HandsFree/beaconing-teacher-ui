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
	lexeme string
	kind   tokenType
}

func (t *token) String() string {
	return "{" + t.lexeme + ", " + string(t.kind) + "} "
}

func makeToken(lexeme string, kind tokenType) *token {
	return &token{
		lexeme, kind,
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
	return makeToken(":", colon)
}

func (l *lexer) recognizeQuotedString() *token {
	l.consume() // "
	lexeme := l.consumeWhile(func(r rune) bool {
		return r != '"'
	})
	if l.hasNext() && l.peek() == '"' {
		l.consume() // "
	}
	return makeToken("\""+lexeme+"\"", quoted)
}

// identifier is
// a-Z 0-9 _
// foo_Bar
// foo_bar123
// FOOBAR_foo_123 etc...
func (l *lexer) recognizeIdentifier() *token {
	lexeme := l.consumeWhile(func(r rune) bool {
		return unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_'
	})
	return makeToken(lexeme, identifier)
}

func (l *lexer) recognizeTerm() *token {
	lexeme := l.consumeWhile(func(r rune) bool {
		return !unicode.IsLetter(r) && r != '"' && r != ':'
	})
	return makeToken(lexeme, term)
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
