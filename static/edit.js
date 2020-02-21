let input = document.querySelector('.input');
let lis = document.getElementById('auto');

input.addEventListener('keyup', inChange);
var caret = new VanillaCaret(input);

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
  // init()
  
  let mess = printMessage("kokoko");

  console.log('aaa '+mess);
  

  let caretPos = caret.getPos();

  lis.innerHTML = '';
  const plain = input.innerText;
  // console.log(plain);

  const plainArray = input.innerText.split(/(\s+|\w+|\(|\))/).filter(item => item.length > 0);
  
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
    else if (plainArray[i] === '(' || plainArray[i] === ')') {
      if (plainArray[i] === '(') {
        if (opening === false) {
          opening = true;
        }
        else {
          depthIndex += 1;
        }
      }
      else {
        if (opening === true) {
          opening = false;
        }
        else {
          depthIndex -= 1;
        }
      }
      let cssClassVal = '';
      if (depthIndex < 1) {
        cssClassVal = 'error';
      }
      else {
        cssClassVal = 'par' + depthIndex;
      }
      tokenList.push({ text: plainArray[i], cssClass: cssClassVal, depth: depthIndex, type: 'openingParentheses' })
    }
    else if (plainArray[i].toUpperCase() === 'AND' || plainArray[i].toUpperCase() === 'OR') {
      tokenList.push({ text: plainArray[i].toUpperCase(), cssClass: 'oper', type: 'operator' })
    }
    else if (isWord(plainArray[i])) {
      //check for left parameter recognition
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
      //check for mid parameter recognition
      else if (checkPreviousTypeList(i, midParam.map(g => g.hasLeft))) {
        const hasLeft = midParam.filter(g =>
          g.hasLeft === tokenList[i - 2].type
        );
        let notFound = true;

        index = 0;
        while (index < hasLeft.length && notFound) {
          opIndex = 0;
          while (opIndex < hasLeft[index].operators.length && notFound) {
            if (hasLeft[index].operators[opIndex] === plainArray[i]) {
              tokenList.push({ text: plainArray[i], type: hasLeft[index].type, cssClass: cssClass[hasLeft[index].type] })
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
      //check for right parameter recognition
      else if (checkPreviousTypeList(i, midParam.map(g => g.type))) {
        const hasLeftGroup = midParam.find(g =>
          g.type === tokenList[i - 2].type
        );
        let notFound = true;

        opIndex = 0;
        while (opIndex < hasLeftGroup.rightParam.length && notFound) {
          if (hasLeftGroup.rightParam[opIndex].name === plainArray[i]) {
            tokenList.push({ text: plainArray[i], type: hasLeftGroup.rightParam[opIndex].type, cssClass: hasLeftGroup.rightParam[opIndex].type })
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
    //check for left Parameter suggestions
    if (idx === 0 || ((idx - 1) === 0 && tokenList[0].type === 'whitespace')
      || tokenList[idx - 1].text === '('
      || (tokenList[idx - 2].type === 'operator'
        && tokenList[idx - 1].type === 'whitespace')
      || (tokenList[idx - 2].text === '('
        && tokenList[idx - 1].type === 'whitespace')
    ) {
      let ac = [];

      for (let i = 0; i < leftParam.length; i++) {
        for (let z = 0; z < leftParam[i].props.length; z++) {
          if (leftParam[i].props[z].name.includes(word)) {
            ac.push(leftParam[i].props[z].name);
          }
        }
      }
      ac.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f;
        lis.appendChild(el);
      })
    }
    //check for mid Parameter suggestions
    else if (checkPreviousTypeList(idx, midParam.map(g => g.hasLeft))) {

      const combinedOper = midParam.filter(g =>
        g.hasLeft === tokenList[idx - 2].type
      ).reduce((acc, cur) => {
        if (acc) {
          return acc.concat(cur.operators);
        }
        return cur.operators;
      }, [])
      // console.log(combinedCity);
      combinedOper.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f;
        lis.appendChild(el);
      })
    }
    //check for right Parameter suggestions
    else if (checkPreviousTypeList(idx, midParam.map(g => g.type))) {
      const hasLeftGroup = midParam.find(g =>
        g.type === tokenList[idx - 2].type
      );
      hasLeftGroup.rightParam.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
  }

  input.innerHTML = '';
  let formated = '';

  for (let i = 0; i < tokenList.length; i++) {
    formated += '<span class="' + tokenList[i].cssClass + '">' + tokenList[i].text + '</span>';
  }

  console.log(tokenList);


  input.innerHTML = formated;

  caret.setPos(caretPos);

}
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}


const midParam = [
  {
    type: 'carState',
    hasLeft: 'car',
    operators: ['is', 'notIs'],
    rightParam: [
      { name: 'New', type: 'prop' },
      { name: 'Old', type: 'prop' },
      { name: 'Abandoned', type: 'prop' }
    ]
  },
  {
    type: 'buildings',
    hasLeft: 'city',
    operators: ['contain', 'notContain'],
    rightParam: [
      { name: 'Stadium', type: 'prop' },
      { name: 'Zoo', type: 'prop' },
      { name: 'Casino', type: 'prop' }
    ]
  },
  {
    type: 'states',
    hasLeft: 'city',
    operators: ['is', 'notIs'],
    rightParam: [
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
