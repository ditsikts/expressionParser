let input = document.querySelector('.input');
let lis = document.getElementById('auto');

input.addEventListener('keyup', inChange);
var caret = new VanillaCaret(input);

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

  if (word.length > 0) {
    while (plain.charAt(caretPos - backWord) != null
      && plain.charAt(caretPos - backWord) != undefined
      && (plain.charCodeAt(caretPos - backWord) == 160
        || plain.charCodeAt(caretPos - backWord) == 32)) {

      backWord += 1;//keeps position of previous non space char
    }

  }
  return [word, backWord];
}

function inChange(e) {

  let caretPos = caret.getPos();

  plain = input.innerText;
  lis.innerHTML = '';

  const [word, backWord] = wordAtCaret(plain, caretPos);

  if (plain.charAt(caretPos - backWord) === '(') {
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

  let parMarks = '';
  depthIndex = 0;
  opening = true;


  for (let i = 0; i < plain.length; i++) {

    if (plain.charCodeAt(i) === 160) {
      parMarks += 'S';
    }
    else if (plain[i] === '(') {
      if (opening === false) {
        parMarks += depthIndex;
        opening = true;
      }
      else {
        depthIndex += 1;
        parMarks += depthIndex;
      }
    }
    else if (plain[i] === ')') {
      if (opening === true) {

        parMarks += depthIndex;
        opening = false;
      }
      else {
        depthIndex -= 1;
        parMarks += depthIndex;
      }
    }
    else if (plain[i] === 'O' && plain[i + 1] === 'R'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 2])) {

      parMarks += 'OO';
      i += 1;
    }
    else if (plain[i] === 'A' && plain[i + 1] === 'N' && plain[i + 2] === 'D'
      && !isLetter(plain[i - 1]) && !isLetter(plain[i + 3])) {

      parMarks += 'OOO';
      i += 2;
    }
    else if (isLetter(plain[i]) && !isLetter(plain[i - 1])) {

      let iOf = -1;
      let k = 0;
      let notFound = true;
      while (notFound && k < cities.length) {
        iOf = plain.indexOf(cities[k].name, i);

        if (iOf === i) {
          let = cat = 'N';
          if (cities[k].country === 'USA') {
            cat = 'U';
          }
          else if (cities[k].country === 'Italy') {
            cat = 'I';
          }
          for (let m = 0; m < cities[k].name.length; m++) {
            parMarks += cat;
          }
          notFound = false;
          i += cities[k].name.length - 1;
        }
        k += 1;
      }
      if (notFound) {
        parMarks += 'N';
      }

    }
    else {
      parMarks += 'N';
    }
  }
  //normalize parMarks
  // parMarks = [...parMarks].reduce((acc, curr) => {
  //   acc += (4 - curr);
  //   return acc;
  // }, '')

  console.log(parMarks);
  // console.log(plain);

  let formated = '';
  let cWord = '';

  // const gatherSimilarChars = (character)=>{

  // }

  for (let i = 0; i < parMarks.length; i++) {
    // console.log(parMarks.charAt(i));

    if (plain[i] === '(' || plain[i] === ')') {

      formated += '<span class="par' + parMarks.charAt(i) + '">' + plain[i] + '</span>'
    }
    else if (parMarks[i] === 'O') {
      cWord += plain[i];
      i++;
      while (parMarks[i] === 'O') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'oper' + '">' + cWord + '</span>'
    }
    else if (parMarks[i] === 'U') {
      cWord += plain[i];
      i++;
      while (parMarks[i] === 'U') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'usa' + '">' + cWord + '</span>'
    }
    else if (parMarks[i] === 'I') {
      cWord += plain[i];
      i++;
      while (parMarks[i] === 'I') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'italy' + '">' + cWord + '</span>'
    }
    else if (parMarks[i] === 'S') {
      formated += '<span>' + plain[i] + '</span>';
    }
    else {
      formated += '<span class="' + 'error' + '">' + plain[i] + '</span>';
    }
    cWord = '';
  }

  input.innerHTML = formated;

  caret.setPos(caretPos);
  console.log(groups.buildings.oper[0]);

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
    "name": "New_York",
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

