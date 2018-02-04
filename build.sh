#!/bin/bash

run() {
	cd frontend/
	yarn b
	cd ../
	go run *.go
}

run_fmt() {
	go fmt git.juddus.com/HFC/beaconing/auth
	go fmt git.juddus.com/HFC/beaconing/cfg
	go fmt git.juddus.com/HFC/beaconing/json
	go fmt git.juddus.com/HFC/beaconing/page
	go fmt git.juddus.com/HFC/beaconing/req
	go fmt git.juddus.com/HFC/beaconing/route
	go fmt git.juddus.com/HFC/beaconing/serv
	go fmt *.go
}

show_help() {
	echo "./build.sh cmd_name"
	echo "for example ./build.sh s"
	echo "r -> compile and run the code-base"
	echo "h -> show this help message"
	echo "f -> run go fmt on everything"
}

setup() {
	go get -u github.com/kardianos/govendor
	govendor sync
}

case "$1" in
	s) setup;;
	r) run;;
	f) run_fmt;;
	h,*) show_help;;
esac
