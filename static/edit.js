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
      let ac = fields.filter((f) => {

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
      while (notFound && k < fields.length) {
        console.log('name#' + fields[k].name);
        iOf = plain.indexOf(fields[k].name, i);
        console.log('iof#' + iOf + ' i#' + i);

        if (iOf === i) {
          let = cat = 'N';
          if (fields[k].category === 'BUILT_IN') {
            cat = 'B';
          }
          else if (fields[k].category === 'FLOW') {
            cat = 'F';
          }
          for (let m = 0; m < fields[k].name.length; m++) {
            parMarks += cat;
          }
          notFound = false;
          i += fields[k].name.length - 1;
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
    else if (parMarks[i] === 'B') {

      formated += '<span class="' + 'built_in' + '">' + plain[i] + '</span>'
    }
    else if (parMarks[i] === 'F') {

      formated += '<span class="' + 'flow' + '">' + plain[i] + '</span>'
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

const fields = [
  {
    "id": "6baf1680-6711-4869-a16e-13244e440e0a",
    "name": "Ani",
    "category": "BUILT_IN"
  },
  {
    "id": "ae46cfb3-60d3-4df4-9b2b-02d7050f0571",
    "name": "Aud",
    "category": "BUILT_IN"
  },
  {
    "id": "5c053da1-dd81-48d3-ab1a-21438a8c7246",
    "name": "CoErrors",
    "category": "FLOW"
  },
  {
    "id": "b64e11ec-817e-4b51-9d2d-d0fd3d9e710c",
    "name": "CoLowCon",
    "category": "FLOW"
  },
  {
    "id": "100a3a79-1ffe-4a3d-af09-43017047ff56",
    "name": "CoNoInputs",
    "category": "BUILT_IN"
  },
  {
    "id": "3f4ad2d2-71f8-4809-9689-57339f498a30",
    "name": "CoNoMatches",
    "category": "BUILT_IN"
  },
  {
    "id": "6e908664-ecec-4da2-ad87-489d5267b0c3",
    "name": "CoRejections",
    "category": "BUILT_IN"
  },
  {
    "id": "9a7f8836-5486-4356-907e-3297ae4f3a01",
    "name": "CoSameStateEvents",
    "category": "BUILT_IN"
  },
  {
    "id": "f1aea4e1-5a33-4575-86ac-cc46e76707a1",
    "name": "CrError",
    "category": "BUILT_IN"
  },
  {
    "id": "549e0ec0-e721-4f63-a1f8-8ad93f39f467",
    "name": "CuHour",
    "category": "BUILT_IN"
  },
  {
    "id": "a799af41-a94f-44ac-a28d-9928d4800b85",
    "name": "CuTime",
    "category": "BUILT_IN"
  },
]