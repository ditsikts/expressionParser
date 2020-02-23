let inputWasm = document.querySelector('.inputWasm');
let lisWasm = document.getElementById('autoWasm');

inputWasm.addEventListener('keyup', inChangeWasm);
var caretWasm = new VanillaCaret(inputWasm);


function inChangeWasm(e) {
    const plainWasm = inputWasm.innerText
        .replace(/\u00A0/g, '&nbsp;')
    let caretPos = caretWasm.getPos();

    let mess = generateTokens(
        plainWasm,
        JSON.stringify(leftParam),
        JSON.stringify(midParam)
    );

    console.log(mess);
}
