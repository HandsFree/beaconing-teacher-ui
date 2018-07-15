package util

import (
	"os"
	"runtime"
)

var (
	textReset   string
	textBold    string
	textRed     string
	textGreen   string
	textYellow  string
	textBlue    string
	textMagenta string
	textCyan    string
	textWhite   string
)

func init() {
	// TODO take this from configuration file.
	if os.Getenv("COLOR") == "0" {
		return
	}

	switch runtime.GOOS {
	case "linux", "darwin", "freebsd":
		textReset = "\x1B[00m"
		textBold = "\x1B[01m"
		textRed = "\x1B[31m"
		textGreen = "\x1B[32m"
		textYellow = "\x1B[33m"
		textBlue = "\x1B[34m"
		textMagenta = "\x1B[35m"
		textCyan = "\x1B[36m"
		textWhite = "\x1B[37m"
	}
}

func Bold(s string) string {
	return textBold + s + textReset
}

func Red(s string) string {
	return textRed + s + textReset
}

func Green(s string) string {
	return textGreen + s + textReset
}

func Yellow(s string) string {
	return textYellow + s + textReset
}

func Blue(s string) string {
	return textBlue + s + textReset
}

func Magenta(s string) string {
	return textMagenta + s + textReset
}

func Cyan(s string) string {
	return textCyan + s + textReset
}

func White(s string) string {
	return textWhite + s + textReset
}
