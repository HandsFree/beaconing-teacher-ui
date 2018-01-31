#!/bin/bash

run() {
	if ! test -e "config/api.go"; then
		echo "No config/api.go file!"
		exit -1
	fi
	go run *.go
}

run_fmt() {
	go fmt git.juddus.com/HFC/beaconing/page
	go fmt git.juddus.com/HFC/beaconing/serv
	go fmt git.juddus.com/HFC/beaconing/req
	go fmt git.juddus.com/HFC/beaconing/route
	go fmt git.juddus.com/HFC/beaconing/auth
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

	if ! test -e "config/api.go"; then
		touch config/api.go
		echo "Secret file created at config/api.go"
		echo "Read config/README.md for more details"
	fi
}

case "$1" in
	s) setup;;
	r) run;;
	f) run_fmt;;
	h,*) show_help;;
esac
