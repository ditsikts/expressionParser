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

let previousPlain = '';
// let plain = '';

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


  const plain = input.innerText;


  // let parMarks3 =plain.split(/([\s+|\W])/)
  let parMarks3 =plain.split(/(\s+|\w+|\(|\))/)
  let plainIndex = 0;
  parMarks3 = parMarks3.filter(item=>
    item.length>0
  )
  console.log(parMarks3)
  // console.log(  plain.split(/(\s+)/)  );





  return;


  let caretPos = caret.getPos();

  lis.innerHTML = '';

  // console.log('start' + plain);

  depthIndex = 0;
  opening = true;

  let parMarks2 = [];
  let simiChars = '';

  for (let i = 0; i < plain.length; i++) {

    if (plain.charCodeAt(i) === 160
      || plain.charCodeAt(i) === 32) {
      simiChars += '&nbsp;';
      i++;
      while (plain.charCodeAt(i) === 160 || plain.charCodeAt(i) === 32) {
        simiChars += '&nbsp;';
        i++;
      }
      i--;
      parMarks2.push({ text: simiChars, cssClass: 'nostyle', type: 'whitespace' })
      simiChars = '';
    }
    else if (plain[i] === '(') {
      if (opening === false) {
        opening = true;
      }
      else {
        depthIndex += 1;
      }
      parMarks2.push({ text: plain[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'openingParentheses' })
    }
    else if (plain[i] === ')') {
      if (opening === true) {
        opening = false;
      }
      else {
        depthIndex -= 1;
      }
      parMarks2.push({ text: plain[i], cssClass: 'par' + depthIndex, depth: depthIndex, type: 'closingParentheses' })
    }
    else if (plain[i] === 'O' && plain[i + 1] === 'R'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 2])) {

      parMarks2.push({ text: 'OR', cssClass: 'oper', type: 'operator' })
      i += 1;
    }
    else if (plain[i] === 'A' && plain[i + 1] === 'N' && plain[i + 2] === 'D'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 3])) {

      parMarks2.push({ text: 'AND', cssClass: 'oper', type: 'operator' })
      i += 2;
    }
    else if (isLetter(plain[i]) && !isLetter(plain[i - 1])) {

      if (parMarks2[parMarks2.length - 1].text === '('
        || parMarks2[parMarks2.length - 2].type === 'operator'
        || (parMarks2[parMarks2.length - 2].text === '('
          && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

        let notFound = true;
        let iOf = -1;
        let k = 0;

        while (notFound && k < leftPart.cities.length) {
          iOf = plain.indexOf(leftPart.cities[k].name, i);
          if (iOf === i) {
            parMarks2.push({ text: leftPart.cities[k].name, type: leftPart.cities[k].type, cssClass: cssClass[leftPart.cities[k].country] });
            notFound = false;
            i += leftPart.cities[k].name.length - 1;
          }
          k += 1;
        }

        if (notFound) {
          const [word,] = wordAtIndex(plain, i);
          parMarks2.push({ text: word, cssClass: 'error' });
          i += word.length - 1;
        }
      }
      else if ((parMarks2[parMarks2.length - 2].type === 'city'
        && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

        let notFound = true;
        let iOf = -1;

        const combinedCity = groups.filter(g =>
          g.combined === 'city'
        )
        let outerK = 0;
        while (notFound && outerK < combinedCity.length) {
          let k = 0;

          while (notFound && k < combinedCity[outerK].operators.length) {
            iOf = plain.indexOf(combinedCity[outerK].operators[k], i);
            if (iOf === i) {
              parMarks2.push({ text: combinedCity[outerK].operators[k], type: combinedCity[outerK].type, cssClass: cssClass[combinedCity[outerK].type] });
              notFound = false;
              i += combinedCity[outerK].operators[k].length - 1;
            }
            k += 1;
          }
          outerK += 1;
        }
        if (notFound) {
          const [word,] = wordAtIndex(plain, i);
          parMarks2.push({ text: word, cssClass: 'error' });
          i += word.length - 1;
        }
      }
      else if ((parMarks2[parMarks2.length - 2].type === 'buildings'
        && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

        let notFound = true;
        let iOf = -1;
        let k = 0;

        while (notFound && k < groups[0].props.length) {
          iOf = plain.indexOf(groups[0].props[k].name, i);
          if (iOf === i) {
            parMarks2.push({ text: groups[0].props[k].name, type: groups[0].props[k].type, cssClass: cssClass[groups[0].props[k].type] });
            notFound = false;
            i += groups[0].props[k].name.length - 1;
          }
          k += 1;
        }
        if (notFound) {
          const [word,] = wordAtIndex(plain, i);
          parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
          i += word.length - 1;
        }
      }
      else if ((parMarks2[parMarks2.length - 2].type === 'states'
        && parMarks2[parMarks2.length - 1].type === 'whitespace')) {

        let notFound = true;
        let iOf = -1;
        let k = 0;

        while (notFound && k < groups[1].props.length) {
          iOf = plain.indexOf(groups[1].props[k].name, i);
          if (iOf === i) {
            parMarks2.push({ text: groups[1].props[k].name, type: groups[1].props[k].type, cssClass: cssClass[groups[1].props[k].type] });
            notFound = false;
            i += groups[1].props[k].name.length - 1;
          }
          k += 1;
        }
        if (notFound) {
          const [word,] = wordAtIndex(plain, i);
          parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
          i += word.length - 1;
        }
      }
      else {
        const [word,] = wordAtIndex(plain, i);
        parMarks2.push({ text: word, cssClass: 'error', type: 'error' });
        i += word.length - 1;
      }

    }
    else {
      parMarks2.push({ text: plain[i], cssClass: 'error', type: 'error' })
      console.log('#' + plain[i] + '#');
      // console.log('charcode #' + plain.charCodeAt(i) + '#');

    }

  }

  const [word, forWord, backWord] = wordAtIndex(plain, caretPos);


  if (word != '') {
    let caretPosTemp = caretPos;
    let curLength = 0;
    let idx = 0;
    while (caretPosTemp > curLength) {
      curLength = parMarks2[idx].text.length;
      if (parMarks2[idx].text.includes('&nbsp;')) {
        curLength = parMarks2[idx].text.length / 6;
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
    if (parMarks2[idx - 1].text === '('
      || (parMarks2[idx - 2].type === 'operator'
        && parMarks2[idx - 1].type === 'whitespace')
      || (parMarks2[idx - 2].text === '('
        && parMarks2[idx - 1].type === 'whitespace')
    ) {
      let ac = leftPart.cities.filter((f) => {
        return f.name.includes(word);
      })
      ac.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
    else if (parMarks2[idx - 2].type === 'city'
      && parMarks2[idx - 1].type === 'whitespace') {

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
    else if (parMarks2[idx - 2].type === 'buildings'
      && parMarks2[idx - 1].type === 'whitespace') {

      groups[0].props.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
    else if (parMarks2[idx - 2].type === 'states'
      && parMarks2[idx - 1].type === 'whitespace') {

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

  for (let i = 0; i < parMarks2.length; i++) {
    formated += '<span class="' + parMarks2[i].cssClass + '">' + parMarks2[i].text + '</span>';
  }

  console.log(parMarks2.length);
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
const leftPart = {
  cities: [
    {
      "id": "1",
      "name": "Phoenix",
      "country": "USA",
      "type": "city"
    },
    {
      "id": "2",
      "name": "Florida",
      "country": "USA",
      "type": "city"
    },
    {
      "id": "3",
      "name": "NewYork",
      "country": "USA",
      "type": "city"
    },
    {
      "id": "4",
      "name": "Parma",
      "country": "Italy",
      "type": "city"
    },
    {
      "id": "5",
      "name": "Naples",
      "country": "Italy",
      "type": "city"
    },

    {
      "id": "6",
      "name": "Paris",
      "country": "France",
      "type": "city"
    },
    {
      "id": "7",
      "name": "Nice",
      "country": "France",
      "type": "city"
    },
  ]
}
