#!/bin/bash

function do_assign() {
	curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://192.168.1.106:8081/intent/assign/$($1)/to/$($2)
}

# these are all glps
# that should exist

do_assign 1, 40
do_assign 1, 42
do_assign 1, 20
do_assign 1, 200
