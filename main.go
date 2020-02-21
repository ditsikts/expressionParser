package main
import (
	"syscall/js"
)



func printMessage(this js.Value, inputs []js.Value) interface{} {
	message := inputs[0].String()

	document := js.Global().Get("document")
	p := document.Call("createElement", "p")
	p.Set("innerHTML", message)
	document.Get("body").Call("appendChild", p)
	
    return 5
}

func main() {

	c :=make (chan struct{},0)
	
	js.Global().Set("printMessage", js.FuncOf(printMessage))

	<-c
	println("We are out of here")
}