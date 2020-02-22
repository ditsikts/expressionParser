let inputWasm = document.querySelector('.inputWasm');
let lisWasm = document.getElementById('autoWasm');

inputWasm.addEventListener('keyup', inChangeWasm);
var caretWasm = new VanillaCaret(inputWasm);


function inChangeWasm(e) {

    const plainWasm = inputWasm.innerText;
    let caretPos = caretWasm.getPos();

    let mess = generateTokens(
        plainWasm,
        JSON.stringify({
            "id": "3",
            "name": "NewYork",
            "category": "USA"
          })
        );

    console.log(mess);
}
