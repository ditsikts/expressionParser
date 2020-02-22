package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"syscall/js"
)

type Prop struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
}
type LeftParam struct {
	Type    string   `json:"type"`
	HasLeft []string `json:"hasLeft"`
	Props   []Prop   `json:"props"`
}

func generateTokens(this js.Value, inputs []js.Value) interface{} {
	plain := inputs[0].String()
	leftParamJSON := inputs[1].String()
	midParamJSON := inputs[2].String()
	var leftParam1 []LeftParam
	err := json.Unmarshal([]byte(leftParamJSON), &leftParam1)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(leftParam1[1].Type)
	re := regexp.MustCompile(`\w+|\s+|!=|.`)
	println(leftParamJSON)
	plainSplited := re.FindAllString(plain, -1)

	for i := range plainSplited {
		fmt.Println(plainSplited[i])
	}
	// document := js.Global().Get("document")
	// p := document.Call("createElement", "p")
	// p.Set("innerHTML", plain)
	// document.Get("body").Call("appendChild", p)

	return "=================="
}

func main() {

	c := make(chan struct{}, 0)

	js.Global().Set("generateTokens", js.FuncOf(generateTokens))

	<-c
	println("We are out of here")
}
