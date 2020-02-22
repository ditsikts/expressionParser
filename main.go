package main
import (
	"fmt"
	"syscall/js"
	"regexp"
	"encoding/json"
)

type prop struct{
	id int `json:"id"`
	name string `json:"name"`
	category string `json:"category"`
}

func generateTokens(this js.Value, inputs []js.Value) interface{} {
	plain := inputs[0].String()
array := inputs[1].String()
jsonArray := []byte(array)
var prop1 prop
err := json.Unmarshal(jsonArray, &prop1)
if err != nil {
    fmt.Println(err.Error())
}
fmt.Println(prop1.name)
    re := regexp.MustCompile(`\w+|\s+|!=|.`)
	println(array)
	plainSplitted := re.FindAllString(plain, -1)
	
	for i := range(plainSplitted) {
        fmt.Println(plainSplitted[i])
    }
	// document := js.Global().Get("document")
	// p := document.Call("createElement", "p")
	// p.Set("innerHTML", plain)
	// document.Get("body").Call("appendChild", p)
	
    return "=================="
}

func main() {

	c :=make (chan struct{},0)
	
	js.Global().Set("generateTokens", js.FuncOf(generateTokens))

	<-c
	println("We are out of here")
}