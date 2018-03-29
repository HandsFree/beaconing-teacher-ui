GO_FILES := $(wildcard src/*.go)
OUT := beaconing

all: $(OUT)
	make front

back: $(GO_FILES)

fmt:
	go fmt git.juddus.com/HFC/beaconing/backend...

front:
	cd ../frontend && yarn b

prodfront:
	cd ../frontend && yarn bp

$(OUT): $(GO_FILES)
	go build -o $(OUT)

prodall: $(OUT)
	make prodfront

clean:
	rm beaconing

.PHONY: all fmt front prodall prodfront
