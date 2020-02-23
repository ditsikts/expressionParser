package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"syscall/js"
)

type Token struct {
	Text       string
	Type       string
	CssClass   string
	DepthIndex int
}

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
	plain := strings.ReplaceAll(inputs[0].String(), " ", "&nbsp;")
	leftParamJSON := inputs[1].String()
	//midParamJSON := inputs[2].String()

	var leftParam1 []LeftParam
	err := json.Unmarshal([]byte(leftParamJSON), &leftParam1)
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Println(leftParam1[1].Type)
	re := regexp.MustCompile(`\w+|(&nbsp;)+|!=|.`)
	plainSplitted := re.FindAllString(plain, -1)

	fmt.Println(plainSplitted)

	var tokenList []Token
	opening := true
	index := 0
	depthIndex := 0
	for index < len(plainSplitted) {
		if strings.Contains(plainSplitted[index], "&nbsp;") {
			tokenList = append(tokenList, Token{
				Text:     plainSplitted[index],
				Type:     "whitespace",
				CssClass: "nostyle",
			})
		} else if plainSplitted[index] == "(" {
			if opening == false {
				opening = true
			} else {
				depthIndex += 1
			}
			tokenList = append(tokenList, Token{
				Text:       "(",
				Type:       "openingParentheses",
				CssClass:   strings.Join([]string{"par", strconv.Itoa(depthIndex)}, ""),
				DepthIndex: depthIndex,
			})
		} else if plainSplitted[index] == ")" {
			if opening == true {
				opening = false
			} else {
				depthIndex -= 1
			}
			tokenList = append(tokenList, Token{
				Text:       ")",
				Type:       "closingParentheses",
				CssClass:   strings.Join([]string{"par", strconv.Itoa(depthIndex)}, ""),
				DepthIndex: depthIndex,
			})
		} else {
			tokenList = append(tokenList, Token{
				Text:     plainSplitted[index],
				Type:     "error",
				CssClass: "error",
			})
		}

		index += 1
	}
	fmt.Println(tokenList)
	var sb strings.Builder
	for i := range tokenList {
		sb.WriteString(`<span class="`)
		sb.WriteString(tokenList[i].CssClass)
		sb.WriteString(`">`)
		sb.WriteString(tokenList[i].Text)
		sb.WriteString(`</span>`)
	}
	fmt.Println(sb.String())
	document := js.Global().Get("document")
	p := document.Call("getElementById", "inputWasm")
	p.Set("innerHTML", "")
	p.Set("innerHTML", sb.String())

	return "=================="
}

func main() {

	c := make(chan struct{}, 0)

	js.Global().Set("generateTokens", js.FuncOf(generateTokens))

	<-c
	println("We are out of here")
}
