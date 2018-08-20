package util

import (
	"fmt"
	"os"
	"time"
)

type LogLevel uint

const (
	FatalLog LogLevel = iota
	VerboseLog
	ErrorLog
	WarnLog
	InfoLog
)

func Verbose(msg ...interface{}) {
	Log(VerboseLog, msg...)
}

func Fatal(msg ...interface{}) {
	Log(FatalLog, msg...)
	os.Exit(1)
}

func Warn(msg ...interface{}) {
	Log(WarnLog, msg...)
}

func Error(msg ...interface{}) {
	Log(ErrorLog, msg...)
}

func Info(msg ...interface{}) {
	Log(InfoLog, msg...)
}

func Log(level LogLevel, msg ...interface{}) {
	when := fmt.Sprintf("%s: ", time.Now().Format("2006-01-02 15:04:05"))
	pipe := os.Stdout

	switch level {
	case ErrorLog:
		fallthrough
	case FatalLog:
		pipe = os.Stderr
		fmt.Printf(Bold(Red(when)))
	case VerboseLog:
		fmt.Print(Bold(Green(when)))
	case InfoLog:
		fmt.Print(Bold(when))
	case WarnLog:
		fmt.Print(Bold(Yellow(when)))
	}
	fmt.Fprintln(pipe, msg...)
}

// BigLog is the same as Log, however the date
// of the log is placed on its own line
func BigLog(level LogLevel, msg ...interface{}) {
	when := time.Now().Format("2006-01-02 15:04:05")
	pipe := os.Stdout

	switch level {
	case ErrorLog:
		fallthrough
	case FatalLog:
		pipe = os.Stderr
		fmt.Println(Bold(Red(when)))
	case VerboseLog:
		fmt.Println(Bold(Green(when)))
	case InfoLog:
		fmt.Println(Bold(when))
	case WarnLog:
		fmt.Println(Bold(Yellow(when)))
	}

	fmt.Fprintln(pipe, msg...)
}
