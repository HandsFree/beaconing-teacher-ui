#!/bin/bash

setup() {
	go get "github.com/gin-contrib/gzip"
}

run() {
	if ! test -e "secrets.go"; then
		echo "No secrets.go file"
		exit -1
	fi
	go run *.go
}

show_help() {
	echo "./build.sh cmd_name"
	echo "for example ./build.sh s"
	echo "s -> fetches dependencies"
	echo "r -> compile and run the code-base"
}

case "$1" in
	s) setup;;
	r) run;;
	*) show_help;;
esac