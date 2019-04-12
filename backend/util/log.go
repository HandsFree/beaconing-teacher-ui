package util

import (
	"errors"
	"fmt"
	"os"
	"time"

	raven "github.com/getsentry/raven-go"
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
	err := errors.New(fmt.Sprintln(msg...))
	raven.CaptureError(err, nil)

	Log(FatalLog, msg...)
	os.Exit(1)
}

func Warn(msg ...interface{}) {
	raven.CaptureMessage(fmt.Sprintln(msg...), nil)

	Log(WarnLog, msg...)
}

func Error(msg ...interface{}) {
	err := errors.New(fmt.Sprintln(msg...))
	raven.CaptureError(err, nil)

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
		fmt.Printf(when)
	case VerboseLog:
		fmt.Print(when)
	case InfoLog:
		fmt.Print(when)
	case WarnLog:
		fmt.Print(when)
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
		fmt.Println(when)
	case VerboseLog:
		fmt.Println(when)
	case InfoLog:
		fmt.Println(when)
	case WarnLog:
		fmt.Println(when)
	}

	fmt.Fprintln(pipe, msg...)
}
