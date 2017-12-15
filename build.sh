#!/bin/bash

run() {
	if ! test -e "route/secrets.go"; then
		echo "No route/secrets.go file!"
		exit -1
	fi
	go run *.go
}

show_help() {
	echo "./build.sh cmd_name"
	echo "for example ./build.sh s"
	echo "r -> compile and run the code-base"
	echo "h -> show this help message"
}

case "$1" in
	s) setup;;
	r) run;;
	h,*) show_help;;
esac