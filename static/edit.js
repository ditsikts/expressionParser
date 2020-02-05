let input = document.querySelector('.input');
let lis = document.getElementById('auto');

input.addEventListener('keyup', inChange);
var caret = new VanillaCaret(input);


function inChange(e) {

  let caretPos = caret.getPos();

  plain = input.innerText;
  let word = '';
  lis.innerHTML = '';
  let backWord = 1;

  let filterFields = false;

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
  // console.log('forWord: ' + forWord + ' backWord: ' + backWord);

  if (backWord != 1 || forWord != 0) {
    while (plain.charAt(caretPos - backWord) != null
      && plain.charAt(caretPos - backWord) != undefined
      && (plain.charCodeAt(caretPos - backWord) == 160
        || plain.charCodeAt(caretPos - backWord) == 32)) {

      backWord += 1;
    }
    // console.log('#'+plain.charAt(caretPos[0] - backWord)+'#');
  }

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

  spanColors = ['par1', 'par2', 'par3', 'par4'];
  let parMarks = '';
  depthIndex = -1;
  opening = true;
  // (() OR ()) AND ()


  for (let i = 0; i < plain.length; i++) {

    if (plain[i] === '(') {
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
      console.log('===========================');
      // console.log(isLetter(plain[i]) + '#' + !isLetter(plain[i - 1]));

      let iOf = -1;
      // console.log('fields length#' + fields.length);
      let k = 0;
      let notFound = true;
      while (notFound && k < cities.length) {
        console.log('name#' + cities[k].name);
        iOf = plain.indexOf(cities[k].name, i);
        console.log('iof#' + iOf + ' i#' + i);

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
      console.log('===========================');
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
  for (let i = 0; i < parMarks.length; i++) {
    // console.log(parMarks.charAt(i));

    if (plain[i] === '(' || plain[i] === ')') {

      formated += '<span class="' + spanColors[parMarks.charAt(i)] + '">' + plain[i] + '</span>'
    }
    else if (parMarks[i] === 'O') {
      while (parMarks[i] === 'O') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'oper' + '">' + cWord + '</span>'
    }
    else if (parMarks[i] === 'U') {
      while (parMarks[i] === 'U') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'usa' + '">' + cWord + '</span>'
    }
    else if (parMarks[i] === 'I') {
      while (parMarks[i] === 'I') {
        cWord += plain[i];
        i++;
      }
      i--;
      formated += '<span class="' + 'italy' + '">' + cWord + '</span>'
    }
    else {
      formated += '<span>' + plain[i] + '</span>';
    }
    cWord = '';
  }

  input.innerHTML = formated;

  caret.setPos(caretPos);
  // var range = document.createRange();
  // var sel = window.getSelection();
  // range.setStart(input, caretPos);
  // range.collapse(true);
  // sel.removeAllRanges();
  // sel.addRange(range);
  // input.focus();
  // console.log(parMarks);

}
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

/*
style="-webkit-user-select:text;" is needed for iPad

*/
// function getCaretCharacterOffsetWithin(element) {
//   var caretOffset = 0;
//   var doc = element.ownerDocument || element.document;
//   var win = doc.defaultView || doc.parentWindow;
//   var sel;
//   if (typeof win.getSelection != "undefined") {
//     sel = win.getSelection();
//     if (sel.rangeCount > 0) {
//       var range = win.getSelection().getRangeAt(0);
//       var preCaretRange = range.cloneRange();
//       preCaretRange.selectNodeContents(element);
//       preCaretRange.setEnd(range.endContainer, range.endOffset);
//       caretOffset = preCaretRange.toString().length;
//     }
//   } else if ((sel = doc.selection) && sel.type != "Control") {
//     var textRange = sel.createRange();
//     var preCaretTextRange = doc.body.createTextRange();
//     preCaretTextRange.moveToElementText(element);
//     preCaretTextRange.setEndPoint("EndToEnd", textRange);
//     caretOffset = preCaretTextRange.text.length;
//   }
//   return caretOffset;
// }

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