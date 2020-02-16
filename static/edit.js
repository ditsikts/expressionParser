let input = document.querySelector('.input');
let lis = document.getElementById('auto');

input.addEventListener('keyup', inChange);
var caret = new VanillaCaret(input);


// const previousChar = (wordStartPos) => {
//   while (plain.charAt(wordStartPos) != null
//     && plain.charAt(wordStartPos) != undefined
//     && (plain.charCodeAt(wordStartPos) == 160
//       || plain.charCodeAt(wordStartPos) == 32)) {

//     wordStartPos -= 1;//keeps position of previous non space char
//   }
//   return wordStartPos;
// }
const wordAtIndex = (plain, caretPos) => {

  let word = '';
  let backWord = 1;

  while (plain.charAt(caretPos - backWord) != null &&
    isLetter(plain.charAt(caretPos - backWord))) {

    word = plain.charAt(caretPos - backWord) + word;
    backWord += 1;
  }

  let forWord = 0;
  while (plain.charAt(caretPos + forWord) != null &&
    isLetter(plain.charAt(caretPos + forWord))) {

    word += plain.charAt(caretPos + forWord);
    forWord += 1;
  }


  return [word, forWord, backWord - 1];
}

function isWord(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (/*!(code > 47 && code < 58) && // numeric (0-9) */
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

function inChange(e) {

  // if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
  //   console.log('arrowpressed');
  //   return;
  // }

  // elem = input.children[1];
  // if (elem) {
  //   elem.innerText += 'KO';
  // }
  // console.log(input.childNodes);

  // if (input.childNodes[3].nodeType == Node.TEXT_NODE)console.log('found text');


  let caretPos = caret.getPos();

  lis.innerHTML = '';
  const plain = input.innerText;
  // console.log(plain);

  const plainArray = input.innerText.split(/(\s+|\w+|\(|\))/).filter(item => item.length > 0);
  console.log(plainArray);


  depthIndex = 0;
  opening = true;

  let tokenList = [];

  const checkPreviousType = (index, type) => {
    return tokenList[index - 2].type === type
      && tokenList[index - 1].type === 'whitespace';
  }

  const checkPreviousTypeList = (index, typeList) => {
    for (let indexType = 0; indexType < typeList.length; indexType++) {
      if (checkPreviousType(index, typeList[indexType])) {
        return true;
      }
    }
    return false;
  }


  for (let i = 0; i < plainArray.length; i++) {
    if (plainArray[i].charCodeAt(0) === 160 || plainArray[i].charCodeAt(0) === 32) {
      tokenList.push({ text: plainArray[i].replace(/ /g, '&nbsp;'), cssClass: 'nostyle', type: 'whitespace' })
    }
    else if (plainArray[i] === '(') {
      if (opening === false) {
        opening = true;
      }
      else {
        depthIndex += 1;
      }
      tokenList.push({ text: plainArray[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'openingParentheses' })
    }
    else if (plainArray[i] === ')') {
      if (opening === true) {
        opening = false;
      }
      else {
        depthIndex -= 1;
      }
      tokenList.push({ text: plainArray[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'closingParentheses' })
    }
    else if (plainArray[i].toUpperCase() === 'AND' || plainArray[i].toUpperCase() === 'OR') {
      tokenList.push({ text: plainArray[i].toUpperCase(), cssClass: 'oper', type: 'operator' })
    }
    else if (isWord(plainArray[i])) {
      if (i === 0 || ((i - 1) === 0 && tokenList[0].type)
        || tokenList[i - 1].type === 'openingParentheses'
        || checkPreviousTypeList(i, ['openingParentheses', 'operator'])) {

        let notFound = true;

        index = 0;
        while (index < leftParam.length && notFound) {
          opIndex = 0;
          while (opIndex < leftParam[index].props.length && notFound) {
            if (leftParam[index].props[opIndex].name === plainArray[i]) {
              tokenList.push({ text: leftParam[index].props[opIndex].name, type: leftParam[index].type, cssClass: cssClass[leftParam[index].props[opIndex].category] }); notFound = false
              notFound = false
            }
            opIndex += 1;
          }
          index += 1;
        }
        if (notFound) {
          tokenList.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
        }
      }
      else if (checkPreviousTypeList(i, leftParam.map(g => g.type))) {
        const hasLeftCity = groups.filter(g =>
          g.hasLeft === tokenList[i - 2].type
        );
        let notFound = true;

        index = 0;
        while (index < hasLeftCity.length && notFound) {
          opIndex = 0;
          while (opIndex < hasLeftCity[index].operators.length && notFound) {
            if (hasLeftCity[index].operators[opIndex] === plainArray[i]) {
              tokenList.push({ text: plainArray[i], type: hasLeftCity[index].type, cssClass: cssClass[hasLeftCity[index].type] })
              notFound = false
            }
            opIndex += 1;
          }
          index += 1;
        }
        if (notFound) {
          tokenList.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
        }
      }
      else if (checkPreviousTypeList(i, groups.map(g => g.type))) {
        const hasLeftGroup = groups.find(g =>
          g.type === tokenList[i - 2].type
        );
        let notFound = true;

        opIndex = 0;
        while (opIndex < hasLeftGroup.props.length && notFound) {
          if (hasLeftGroup.props[opIndex].name === plainArray[i]) {
            tokenList.push({ text: plainArray[i], type: hasLeftGroup.props[opIndex].type, cssClass: hasLeftGroup.props[opIndex].type })
            notFound = false
          }
          opIndex += 1;
        }
        if (notFound) {
          tokenList.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
        }
      }
      else {
        tokenList.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
      }

    }
    else {
      tokenList.push({ text: plainArray[i], cssClass: 'error', type: 'error' })
    }
  }


  const [word, forWord, backWord] = wordAtIndex(plain, caretPos);

  if (word != '') {
    let caretPosTemp = caretPos;
    let curLength = 0;
    let idx = 0;
    while (caretPosTemp > curLength) {
      curLength = tokenList[idx].text.length;
      if (tokenList[idx].text.includes('&nbsp;')) {
        curLength = tokenList[idx].text.length / 6;
      }
      if (caretPosTemp < curLength) {
        break
      }
      caretPosTemp -= curLength;
      curLength = 0;
      idx += 1;
    }
    console.log("idx :" + idx + " caretPosTemp :" + caretPosTemp + " caretPos :" + caretPos + " forWord :" + forWord + " backWord :" + backWord + " word :" + word);

    // console.log('idx   :' + parMarks2[idx].text);
    // console.log('idx-1 :' + parMarks2[idx - 1].text);
    // console.log('idx-2 :' + parMarks2[idx - 2].text);
    if (forWord === 0) { idx--; }
    if (idx === 0 || ((idx - 1) === 0 && tokenList[0].type === 'whitespace')
      || tokenList[idx - 1].text === '('
      || (tokenList[idx - 2].type === 'operator'
        && tokenList[idx - 1].type === 'whitespace')
      || (tokenList[idx - 2].text === '('
        && tokenList[idx - 1].type === 'whitespace')
    ) {
      let ac = leftParam[0].props.filter((f) => {
        return f.name.includes(word);
      })
      ac.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
    else if (tokenList[idx - 2].type === 'city'
      && tokenList[idx - 1].type === 'whitespace') {

      const combinedCityOper = groups.filter(g =>
        g.hasLeft === 'city'
      ).reduce((acc, cur) => {
        if (acc) {
          return acc.concat(cur.operators);
        }
        return cur.operators;
      }, [])
      // console.log(combinedCity);
      combinedCityOper.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f;
        lis.appendChild(el);
      })
    }
    else if (tokenList[idx - 2].type === 'buildings'
      && tokenList[idx - 1].type === 'whitespace') {

      groups[0].props.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
    else if (tokenList[idx - 2].type === 'states'
      && tokenList[idx - 1].type === 'whitespace') {

      groups[1].props.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }

  }


  //normalize parentheses
  // parMarks = [...parMarks].reduce((acc, curr) => {
  //   acc += (4 - curr);
  //   return acc;
  // }, '')

  input.innerHTML = '';
  let formated = '';

  for (let i = 0; i < tokenList.length; i++) {
    formated += '<span class="' + tokenList[i].cssClass + '">' + tokenList[i].text + '</span>';
  }

  // console.log(tokenList);
  // console.log(formated);


  input.innerHTML = formated;

  caret.setPos(caretPos);

}
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

// const dropdowns = [
//   {previousType:'openingParentheses', },{}
// ]

const groups = [
  {
    type: 'carState',
    hasLeft: 'car',
    operators: ['is', 'notIs'],
    props: [
      { name: 'New', type: 'prop' },
      { name: 'Old', type: 'prop' },
      { name: 'Abandoned', type: 'prop' }
    ]
  },
  {
    type: 'buildings',
    hasLeft: 'city',
    operators: ['contain', 'notContain'],
    props: [
      { name: 'Stadium', type: 'prop' },
      { name: 'Zoo', type: 'prop' },
      { name: 'Casino', type: 'prop' }
    ]
  },
  {
    type: 'states',
    hasLeft: 'city',
    operators: ['is', 'notIs'],
    props: [
      { name: 'Polluted', type: 'prop' },
      { name: 'Overpopulated', type: 'prop' },
      { name: 'Rich', type: 'prop' }
    ]
  }
]

const cssClass = {
  Italy: 'italy',
  USA: 'usa',
  France: 'france',
  buildings: 'buildings',
  states: 'states',
  prop: 'prop',
  Hyundai: 'hyundai',
  Toyota: 'toyota',
  carState: 'states'
}
const leftParam = [
  {
    type: 'city',
    hasLeft: ['openingParentheses', 'operator'],
    props: [
      {
        "id": "1",
        "name": "Phoenix",
        "category": "USA"
      },
      {
        "id": "2",
        "name": "Florida",
        "category": "USA"
      },
      {
        "id": "3",
        "name": "NewYork",
        "category": "USA"
      },
      {
        "id": "4",
        "name": "Parma",
        "category": "Italy"
      },
      {
        "id": "5",
        "name": "Naples",
        "category": "Italy"
      },

      {
        "id": "6",
        "name": "Paris",
        "category": "France"
      },
      {
        "id": "7",
        "name": "Nice",
        "category": "France"
      },
    ]
  },
  {
    type: 'car',
    hasLeft: ['openingParentheses', 'operator'],
    props: [
      {
        "id": "1",
        "name": "Aygo",
        "category": "Toyota"
      },
      {
        "id": "2",
        "name": "Getz",
        "category": "Hyundai"
      },
      {
        "id": "3",
        "name": "Yaris",
        "category": "Toyota"
      },
    ]
  },
]
