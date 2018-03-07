package main

import (
	"fmt"
	"testing"
)

func TestStart(t *testing.T) {
	serv := Start()
	fmt.Println(serv)
}
