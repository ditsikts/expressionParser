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
type RightParam struct {
	Name string `json:"name"`
	Type string `json:"type"`
}
type MidParam struct {
	Type        string       `json:"type"`
	HasLeft     string       `json:"hasLeft"`
	Operators   []string     `json:"operators"`
	RightParams []RightParam `json:"rightParam"`
}

func IsLetters(s string) bool {
	for _, r := range s {
		if !unicode.IsLetter(r) {
			return false
		}
	}
	return true
}

func checkPreviousType(tokenList []Token, index int, tokenType string) bool {
	return tokenList[index-1].Type == "whitespace" &&
		tokenList[index-2].Type == tokenType
}

func checkPreviousTypeList(tokenList []Token, index int, tokenTypeList []string) bool {
	for _, tokenType := range tokenTypeList {
		if checkPreviousType(tokenList, index, tokenType) {
			return true
		}
	}
	return false
}

func generateTokens(this js.Value, inputs []js.Value) interface{} {
	plain := strings.ReplaceAll(inputs[0].String(), " ", "&nbsp;")
	leftParamJSON := inputs[1].String()
	midParamJSON := inputs[2].String()

	var leftParam1 []LeftParam
	err := json.Unmarshal([]byte(leftParamJSON), &leftParam1)
	if err != nil {
		fmt.Println(err.Error())
	}
	var midParam1 []MidParam
	err2 := json.Unmarshal([]byte(midParamJSON), &midParam1)
	if err2 != nil {
		fmt.Println(err2.Error())
	}

	fmt.Println(midParam1[1].Type)

	re := regexp.MustCompile(`\w+|(&nbsp;)+|!=|.`)
	plainSplitted := re.FindAllString(plain, -1)

	fmt.Println(plainSplitted)

	tokenList := make([]Token, len(plainSplitted))

	opening := true
	index := 0
	depthIndex := 0
	//length := len(plainSplitted) - 1
	for index < len(plainSplitted) {
		if strings.Contains(plainSplitted[index], "&nbsp;") {
			tokenList[index] = Token{
				Text:     plainSplitted[index],
				Type:     "whitespace",
				CssClass: "nostyle",
			}
		} else if plainSplitted[index] == "(" {
			if opening == false {
				opening = true
			} else {
				depthIndex += 1
			}
			tokenList[index] = Token{
				Text:       "(",
				Type:       "openingParentheses",
				CssClass:   strings.Join([]string{"par", strconv.Itoa(depthIndex)}, ""),
				DepthIndex: depthIndex,
			}
		} else if plainSplitted[index] == ")" {
			if opening == true {
				opening = false
			} else {
				depthIndex -= 1
			}
			tokenList[index] = Token{
				Text:       ")",
				Type:       "closingParentheses",
				CssClass:   strings.Join([]string{"par", strconv.Itoa(depthIndex)}, ""),
				DepthIndex: depthIndex,
			}

		} else if strings.ToUpper(plainSplitted[index]) == "AND" ||
			strings.ToUpper(plainSplitted[index]) == "OR" {
			tokenList[index] = Token{
				Text:     strings.ToUpper(plainSplitted[index]),
				Type:     "operator",
				CssClass: "oper",
			}
		} else if IsLetters(plainSplitted[index]) {
			if index == 0 ||
				tokenList[index-1].Type == "openingParentheses" ||
				((index-1) == 0 && tokenList[0].Type == "whitespace") ||
				checkPreviousType(tokenList, index, "operator") ||
				checkPreviousType(tokenList, index, "openingParentheses") {
				notFound := true
				lPindex := 0
				for lPindex < len(leftParam1) && notFound {
					prindex := 0
					for prindex < len(leftParam1[lPindex].Props) && notFound {
						if leftParam1[lPindex].Props[prindex].Name == plainSplitted[index] {
							tokenList[index] = Token{
								Text:     leftParam1[lPindex].Props[prindex].Name,
								Type:     leftParam1[lPindex].Type,
								CssClass: strings.ToLower(leftParam1[lPindex].Props[prindex].Category),
							}
							notFound = false
						}
						prindex += 1
					}
					lPindex += 1
				}
				if notFound {
					tokenList[index] = Token{
						Text:     plainSplitted[index],
						Type:     "error",
						CssClass: "error",
					}
				}
			} else if checkPreviousTypeList(tokenList, index, []string{"city", "car"}) {
				var filteredMidParam []MidParam
				for _, tempMidParam := range midParam1{
					if tempMidParam.HasLeft == tokenList[index-2].Type{
						filteredMidParam = append(filteredMidParam, tempMidParam)
					}
				}

				notFound := true
				mPindex := 0
				for mPindex < len(filteredMidParam) && notFound {
					opindex := 0
					for opindex < len(filteredMidParam[mPindex].Operators) && notFound {
						if filteredMidParam[mPindex].Operators[opindex] == plainSplitted[index] {
							tokenList[index] = Token{
								Text:     filteredMidParam[mPindex].Operators[opindex],
								Type:     filteredMidParam[mPindex].Type,
								CssClass: strings.ToLower(filteredMidParam[mPindex].Type),
							}
							notFound = false
						}
						opindex += 1
					}
					mPindex += 1
				}
				if notFound {
					tokenList[index] = Token{
						Text:     plainSplitted[index],
						Type:     "error",
						CssClass: "error",
					}
				}
			}else if checkPreviousTypeList(tokenList, index, []string{"buildings", "states","carstate"}){
				var filteredMidParam MidParam
				for _, tempMidParam := range midParam1{
					if tempMidParam.Type == tokenList[index-2].Type{
						filteredMidParam = tempMidParam
					}
				}

				notFound := true
				rPindex := 0
				for rPindex < len(filteredMidParam.RightParams) && notFound {
					if filteredMidParam.RightParams[rPindex].Name == plainSplitted[index] {
						tokenList[index] = Token{
							Text:     filteredMidParam.RightParams[rPindex].Name,
							Type:     filteredMidParam.Type,
							CssClass: strings.ToLower(filteredMidParam.RightParams[rPindex].Type),
						}
						notFound = false
					}
					rPindex += 1
				}
				if notFound {
					tokenList[index] = Token{
						Text:     plainSplitted[index],
						Type:     "error",
						CssClass: "error",
					}
				}
			} else {
				tokenList[index] = Token{
					Text:     plainSplitted[index],
					Type:     "error",
					CssClass: "error",
				}
			}
		} else {
			tokenList[index] = Token{
				Text:     plainSplitted[index],
				Type:     "error",
				CssClass: "error",
			}
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
