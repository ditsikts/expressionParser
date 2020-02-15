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

  let parMarks3 = [];

  const checkPreviousTypeWithSpace = (index, type) => {
    return parMarks3[index - 2].type === type
      && parMarks3[index - 1].type === 'whitespace';
  }



  for (let i = 0; i < plainArray.length; i++) {
    if (plainArray[i].charCodeAt(0) === 160 || plainArray[i].charCodeAt(0) === 32) {
      parMarks3.push({ text: plainArray[i].replace(/ /g, '&nbsp;'), cssClass: 'nostyle', type: 'whitespace' })
    }
    else if (plainArray[i] === '(') {
      if (opening === false) {
        opening = true;
      }
      else {
        depthIndex += 1;
      }
      parMarks3.push({ text: plainArray[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'openingParentheses' })
    }
    else if (plainArray[i] === ')') {
      if (opening === true) {
        opening = false;
      }
      else {
        depthIndex -= 1;
      }
      parMarks3.push({ text: plainArray[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'closingParentheses' })
    }
    else if (plainArray[i].toUpperCase() === 'AND' || plainArray[i].toUpperCase() === 'OR') {
      parMarks3.push({ text: plainArray[i].toUpperCase(), cssClass: 'oper', type: 'operator' })
    }
    else if (isWord(plainArray[i])) {
      if (checkPreviousTypeWithSpace(i, 'openingParentheses')) {
        let found = leftParam[0].props.find(prop => prop.name === plainArray[i]);
        if (found) {
          parMarks3.push({ text: found.name, type: leftParam[0].type, cssClass: cssClass[found.country] });
        }
        else {

          parMarks3.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
        }
      }
      else {

        parMarks3.push({ text: plainArray[i], cssClass: 'error', type: 'error' });
      }

    }
    else {
      parMarks3.push({ text: plainArray[i], cssClass: 'error', type: 'error' })
    }
  }


  // return;


  //   else if (isLetter(plain[i]) && !isLetter(plain[i - 1])) {

  //     else if ((parMarks2[parMarks2.length - 2].type === 'city'
  //       && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

  //       let notFound = true;
  //       let iOf = -1;

  //       const combinedCity = groups.filter(g =>
  //         g.combined === 'city'
  //       )
  //       let outerK = 0;
  //       while (notFound && outerK < combinedCity.length) {
  //         let k = 0;

  //         while (notFound && k < combinedCity[outerK].operators.length) {
  //           iOf = plain.indexOf(combinedCity[outerK].operators[k], i);
  //           if (iOf === i) {
  //             parMarks2.push({ text: combinedCity[outerK].operators[k], type: combinedCity[outerK].type, cssClass: cssClass[combinedCity[outerK].type] });
  //             notFound = false;
  //             i += combinedCity[outerK].operators[k].length - 1;
  //           }
  //           k += 1;
  //         }
  //         outerK += 1;
  //       }
  //       if (notFound) {
  //         const [word,] = wordAtIndex(plain, i);
  //         parMarks2.push({ text: word, cssClass: 'error' });
  //         i += word.length - 1;
  //       }
  //     }
  //     else if ((parMarks2[parMarks2.length - 2].type === 'buildings'
  //       && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

  //       let notFound = true;
  //       let iOf = -1;
  //       let k = 0;

  //       while (notFound && k < groups[0].props.length) {
  //         iOf = plain.indexOf(groups[0].props[k].name, i);
  //         if (iOf === i) {
  //           parMarks2.push({ text: groups[0].props[k].name, type: groups[0].props[k].type, cssClass: cssClass[groups[0].props[k].type] });
  //           notFound = false;
  //           i += groups[0].props[k].name.length - 1;
  //         }
  //         k += 1;
  //       }
  //       if (notFound) {
  //         const [word,] = wordAtIndex(plain, i);
  //         parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
  //         i += word.length - 1;
  //       }
  //     }
  //     else if ((parMarks2[parMarks2.length - 2].type === 'states'
  //       && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

  //       let notFound = true;
  //       let iOf = -1;
  //       let k = 0;

  //       while (notFound && k < groups[1].props.length) {
  //         iOf = plain.indexOf(groups[1].props[k].name, i);
  //         if (iOf === i) {
  //           parMarks2.push({ text: groups[1].props[k].name, type: groups[1].props[k].type, cssClass: cssClass[groups[1].props[k].type] });
  //           notFound = false;
  //           i += groups[1].props[k].name.length - 1;
  //         }
  //         k += 1;
  //       }
  //       if (notFound) {
  //         const [word,] = wordAtIndex(plain, i);
  //         parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
  //         i += word.length - 1;
  //       }
  //     }
  //     else {
  //       const [word,] = wordAtIndex(plain, i);
  //       parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
  //       i += word.length - 1;
  //     }

  //   }
  //   else {
  //     parMarks2.push({ text: plain[i], cssClass: 'error', type: 'error' })
  //     console.log('#' + plain[i] + '#');
  //     // console.log('charcode #' + plain.charCodeAt(i) + '#');

  //   }

  // }

  const [word, forWord, backWord] = wordAtIndex(plain, caretPos);


  if (word != '') {
    let caretPosTemp = caretPos;
    let curLength = 0;
    let idx = 0;
    while (caretPosTemp > curLength) {
      curLength = parMarks3[idx].text.length;
      if (parMarks3[idx].text.includes('&nbsp;')) {
        curLength = parMarks3[idx].text.length / 6;
        console.log(curLength);

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
    if (parMarks3[idx - 1].text === '('
      || (parMarks3[idx - 2].type === 'operator'
        && parMarks3[idx - 1].type === 'whitespace')
      || (parMarks3[idx - 2].text === '('
        && parMarks3[idx - 1].type === 'whitespace')
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
    else if (parMarks3[idx - 2].type === 'city'
      && parMarks3[idx - 1].type === 'whitespace') {

      const combinedCityOper = groups.filter(g =>
        g.combined === 'city'
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
    else if (parMarks3[idx - 2].type === 'buildings'
      && parMarks3[idx - 1].type === 'whitespace') {

      groups[0].props.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
    else if (parMarks3[idx - 2].type === 'states'
      && parMarks3[idx - 1].type === 'whitespace') {

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

  for (let i = 0; i < parMarks3.length; i++) {
    formated += '<span class="' + parMarks3[i].cssClass + '">' + parMarks3[i].text + '</span>';
  }

  // console.log(parMarks3);
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
    type: 'buildings',
    combined: 'city',
    operators: ['contain', 'notContain'],
    props: [
      { name: 'Stadium', type: 'prop' },
      { name: 'Zoo', type: 'prop' },
      { name: 'Casino', type: 'prop' }
    ]
  },
  {
    type: 'states',
    combined: 'city',
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
  prop: 'prop'
}
const leftParam = [
  {
    type: 'city',
    hasLeft: ['openingParentheses', 'operator'],
    props: [
      {
        "id": "1",
        "name": "Phoenix",
        "country": "USA"
      },
      {
        "id": "2",
        "name": "Florida",
        "country": "USA"
      },
      {
        "id": "3",
        "name": "NewYork",
        "country": "USA"
      },
      {
        "id": "4",
        "name": "Parma",
        "country": "Italy"
      },
      {
        "id": "5",
        "name": "Naples",
        "country": "Italy"
      },

      {
        "id": "6",
        "name": "Paris",
        "country": "France"
      },
      {
        "id": "7",
        "name": "Nice",
        "country": "France"
      },
    ]
  },
]
