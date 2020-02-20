package main
import (
	"syscall/js"
)

var c chan bool

func init() {
	c = make(chan bool)
}

func printMessage(this js.Value, inputs []js.Value) interface{} {
	message := inputs[0].String()

	document := js.Global().Get("document")
	p := document.Call("createElement", "p")
	p.Set("innerHTML", message)
	document.Get("body").Call("appendChild", p)

    c <- true
    return "caal func"
}

func main() {
	js.Global().Set("printMessage", js.FuncOf(printMessage))
	<-c
	println("We are out of here")
}