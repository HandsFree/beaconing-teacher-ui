GO_FILES := $(wildcard src/*.go)
OUT := beaconing

all: $(OUT)
	make front

back: $(GO_FILES)

fmt:
	go fmt git.juddus.com/HFC/beaconing/backend...

front:
	cd frontend && yarn b

$(OUT): $(GO_FILES)
	go build -o $(OUT)

.PHONY: all fmt front