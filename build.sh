#!/bin/bash

run() {
	if ! test -e "route/secrets.go"; then
		echo "No route/secrets.go file!"
		exit -1
	fi
	go run *.go
}

run_fmt() {
	go fmt git.juddus.com/HFC/beaconing.git/page
	go fmt git.juddus.com/HFC/beaconing.git/serv
	go fmt git.juddus.com/HFC/beaconing.git/req
	go fmt git.juddus.com/HFC/beaconing.git/route
	go fmt git.juddus.com/HFC/beaconing.git/auth
	go fmt *.go
}

show_help() {
	echo "./build.sh cmd_name"
	echo "for example ./build.sh s"
	echo "r -> compile and run the code-base"
	echo "h -> show this help message"
	echo "f -> run go fmt on everything"
}

case "$1" in
	s) setup;;
	r) run;;
	f) run_fmt;;
	h,*) show_help;;
esac