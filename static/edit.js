let input = document.querySelector('.input');
let lis = document.getElementById('auto');

input.addEventListener('keyup', inChange);
var caret = new VanillaCaret(input);


const previousChar = (wordStartPos) => {
  while (plain.charAt(wordStartPos) != null
    && plain.charAt(wordStartPos) != undefined
    && (plain.charCodeAt(wordStartPos) == 160
      || plain.charCodeAt(wordStartPos) == 32)) {

    wordStartPos -= 1;//keeps position of previous non space char
  }
  return wordStartPos;
}
const wordAtCaret = (plain, caretPos) => {

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
  backWord = caretPos - backWord;
  if (word.length > 0) {
    backWord = previousChar(backWord);
  }
  return [word, backWord];
}

function inChange(e) {

  let caretPos = caret.getPos();

  plain = input.innerText;
  lis.innerHTML = '';

  console.log('start' + plain);
  const [word, backWord] = wordAtCaret(plain, caretPos);

  if (plain.charAt(backWord) === '(') {
    if (word != '') {
      let ac = cities.filter((f) => {

        return f.name.includes(word);
      })
      ac.forEach(f => {
        let el = document.createElement('li');
        el.innerText = f.name;
        lis.appendChild(el);
      })
    }
  }

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
      parMarks2.push({ text: simiChars, cssClass: 'nostyle' })
      simiChars = '';
    }
    else if (plain[i] === '(') {
      if (opening === false) {
        opening = true;
      }
      else {
        depthIndex += 1;
      }
      parMarks2.push({ text: plain[i], cssClass: 'par' + depthIndex, depth: depthIndex })
    }
    else if (plain[i] === ')') {
      if (opening === true) {
        opening = false;
      }
      else {
        depthIndex -= 1;
      }
      parMarks2.push({ text: plain[i], cssClass: 'par' + depthIndex, depth: depthIndex })
    }
    else if (plain[i] === 'O' && plain[i + 1] === 'R'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 2])) {

      parMarks2.push({ text: 'OR', cssClass: 'oper' })
      i += 1;
    }
    else if (plain[i] === 'A' && plain[i + 1] === 'N' && plain[i + 2] === 'D'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 3])) {

      parMarks2.push({ text: 'AND', cssClass: 'oper' })
      i += 2;
    }
    else if (isLetter(plain[i]) && !isLetter(plain[i - 1])) {

      let iOf = -1;
      let k = 0;
      let notFound = true;
      while (notFound && k < cities.length) {
        iOf = plain.indexOf(cities[k].name, i);

        if (iOf === i) {
          parMarks2.push({ text: cities[k].name, cssClass: cssClass[cities[k].country] })
          notFound = false;
          i += cities[k].name.length - 1;
        }
        k += 1;
      }
      if (notFound) {
        const [word,] = wordAtCaret(plain, i);
        parMarks2.push({ text: word, cssClass: 'error' });
        i += word.length - 1;
      }

    }
    else {
      parMarks2.push({ text: plain[i], cssClass: 'error' })
      console.log('#' + plain[i] + '#');
      // console.log('charcode #' + plain.charCodeAt(i) + '#');

    }

  }

  //normalize parMarks
  // parMarks = [...parMarks].reduce((acc, curr) => {
  //   acc += (4 - curr);
  //   return acc;
  // }, '')

  input.innerHTML = '';
  let formated = '';

  for (let i = 0; i < parMarks2.length; i++) {
    formated += '<span class="' + parMarks2[i].cssClass + '">' + parMarks2[i].text + '</span>';
  }
  console.log('end' + plain);
  console.log(parMarks2);
  console.log(formated);


  input.innerHTML = formated;

  caret.setPos(caretPos);
  // console.log(groups.buildings.oper[0]);

}
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

const groups = {
  buildings: {
    oper: ['have', 'not_have'],
    props: ['Stadium', 'Zoo', 'Casino']
  }
}

const cssClass = {
  Italy: 'italy',
  USA: 'usa'
}
const cities = [
  {
    "id": "1",
    "name": "California",
    "country": "USA"
  },
  {
    "id": "2",
    "name": "Seattle",
    "country": "USA"
  },
  {
    "id": "3",
    "name": "NewYork",
    "country": "USA"
  },
  {
    "id": "4",
    "name": "Venice",
    "country": "Italy"
  },
  {
    "id": "5",
    "name": "Rome",
    "country": "Italy"
  },
  {
    "id": "6",
    "name": "Tokyo",
    "country": "Japan"
  },
  {
    "id": "7",
    "name": "Moscow",
    "country": "Russia"
  },
  {
    "id": "8",
    "name": "Madrid",
    "country": "Spain"
  },
  {
    "id": "9",
    "name": "Athens",
    "country": "Greece"
  },
  {
    "id": "10",
    "name": "Paris",
    "country": "France"
  },
  {
    "id": "11",
    "name": "London",
    "country": "GB"
  },
]

