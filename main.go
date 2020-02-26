package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"syscall/js"
	"unicode"
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

func IsLetters(s string) bool {
	for _, r := range s {
		if !unicode.IsLetter(r) {
			return false
		}
	}
	return true
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
	//length := len(plainSplitted) - 1
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

		} else if strings.ToUpper(plainSplitted[index]) == "AND" ||
			strings.ToUpper(plainSplitted[index]) == "OR" {
			tokenList = append(tokenList, Token{
				Text:     strings.ToUpper(plainSplitted[index]),
				Type:     "operator",
				CssClass: "oper",
			})
		} else if IsLetters(plainSplitted[index]) {
			if index == 0 ||
				((index-1) == 0 && tokenList[0].Type == "whitespace") {
				notFound := true
				lPindex := 0
				for lPindex < len(leftParam1) && notFound {
					prindex := 0
					for prindex < len(leftParam1[lPindex].Props) && notFound {
						if leftParam1[lPindex].Props[prindex].Name == plainSplitted[index] {
							tokenList = append(tokenList, Token{
								Text:     leftParam1[lPindex].Props[prindex].Name,
								Type:     leftParam1[lPindex].Type,
								CssClass: strings.ToLower(leftParam1[lPindex].Props[prindex].Category),
							})
							notFound = false
						}
						prindex += 1
					}
					lPindex += 1
				}
				if notFound {
					tokenList = append(tokenList, Token{
						Text:     plainSplitted[index],
						Type:     "error",
						CssClass: "error",
					})
				}
			} else {
				tokenList = append(tokenList, Token{
					Text:     plainSplitted[index],
					Type:     "error",
					CssClass: "error",
				})
			}
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
