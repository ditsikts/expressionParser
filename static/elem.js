let si_counter = 0;
let parL_counter = 0;
let parR_counter = 0;

const se = document.querySelector('.smart-editor');

function smartDel(e) {
    
    if (e.keyCode == 8) {
        console.log('delete');
        if (e.target.id.startsWith('parR') && 
            e.target.previousSibling.id.startsWith('eqR')) {
            console.log('oops');
            
            se.removeChild(e.target.previousSibling);
            se.removeChild(e.target.previousSibling);
            se.removeChild(e.target.previousSibling);
            se.removeChild(e.target.previousSibling);
            se.removeChild(e.target);
        }
        else {
            se.removeChild(e.target);
        }
    }
    
    parseSE();
}
function eqRChange(e){
    if(e.target.value === '('){
        list = equality();
        se.insertBefore(createSI(), e.target.nextSibling);
        se.insertBefore(parR(), e.target.nextSibling);
        se.insertBefore(list[2], e.target.nextSibling);
        se.insertBefore(list[1], e.target.nextSibling);
        se.insertBefore(list[0], e.target.nextSibling);
        se.insertBefore(parL(), e.target.nextSibling);
        se.insertBefore(createSI(), e.target.nextSibling);
        se.removeChild(e.target);
    }
}
function siChange(e) {

    // console.log(e.target.value);
    console.log(e.keyCode);

    const lastChildIdBefore = se.lastChild.id;

    if(e.keyCode == 8) {
        se.removeChild(e.target);
    }
    else if(e.keyCode == 37) {
        se.firstElementChild.focus();
    }
    else if(e.keyCode == 39) {
        se.lastElementChild.focus();
    }
    else if (e.target.value === 'and') {
        if (e.target.nextSibling == null) {

            e.target.value = '';
            // console.log('oper');
            se.appendChild(oper('AND'));

            se.appendChild(createSI());
        }else{
            
            e.target.value = '';
        se.insertBefore(createSI(), e.target.nextSibling);
        se.insertBefore(oper('AND'), e.target.nextSibling);
        }
    }
    else if (e.target.value === 'or') {
        if (e.target.nextSibling == null) {
            e.target.value = '';
            se.appendChild(oper('OR'));
            se.appendChild(createSI());
        }
        else{
            
            e.target.value = '';
            se.insertBefore(createSI(), e.target.nextSibling);
            se.insertBefore(oper('OR'), e.target.nextSibling);
            }
    }
    else if (e.target.value === ')') {

        e.target.value = '';
        se.insertBefore(parR(), e.target);
    }
    else if (e.target.value === '(') {

        e.target.value = '';

        if (e.target.nextSibling == null) {
            list = equality();
            se.insertBefore(createSI(), e.target.nextSibling);
            se.insertBefore(parR(), e.target.nextSibling);
            se.insertBefore(list[2], e.target.nextSibling);
            se.insertBefore(list[1], e.target.nextSibling);
            se.insertBefore(list[0], e.target.nextSibling);
            se.insertBefore(parL(), e.target.nextSibling);
        }
        else if(!e.target.nextSibling.id.startsWith('parL')){

            list = equality();
            se.insertBefore(createSI(), e.target.nextSibling);
            se.insertBefore(parR(), e.target.nextSibling);
            se.insertBefore(list[2], e.target.nextSibling);
            se.insertBefore(list[1], e.target.nextSibling);
            se.insertBefore(list[0], e.target.nextSibling);
            se.insertBefore(parL(), e.target.nextSibling);
        }
        else{

            se.insertBefore(parL(), e.target.nextSibling);
        }
    }
    parseSE();
}

function parseSE(){
    const els = se.children;
    // console.log(els);
    let parsed = '';
    for (let i=0; i<els.length; i++){
        if (!els[i].id.startsWith('si')){
             parsed += els[i].value;
        }

    }
    document.querySelector('#parsed').innerText = parsed;
}

function oper(op) {
    const oper = document.createElement('input');
    oper.type = 'text';
    oper.value = op;
    oper.classList.add('oper');
    oper.id = 'oper';
    oper.addEventListener('keyup', smartDel);
    oper.setAttribute('list', 'operlist');
    oper.setAttribute('name', 'oper');
    return oper;
}
function parL() {
    const parL = document.createElement('input');
    parL.type = 'text';
    parL.value = '(';
    parL.classList.add('parL');
    parL.id = 'parL-' + parL_counter;
    parL_counter += 1;
    parL.addEventListener('keyup', smartDel);
    // parL.tabIndex = -1;
    parL.readOnly = true;
    return parL;
}
function parR() {
    const parR = document.createElement('input');
    parR.type = 'text';
    parR.value = ')';
    parR.classList.add('parR');
    parR.id = 'parR-' + parR_counter;
    parR_counter += 1;
    parR.addEventListener('keyup', smartDel);
    // parR.tabIndex = -1;
    parR.readOnly = true;
    return parR;
}
function equality() {
    let list = [];
    const eqL = document.createElement('input');
    eqL.type = 'text';
    eqL.classList.add('eqL');
    eqL.id = 'eqL';
    eqL.setAttribute('list', 'eqLlist');
    eqL.setAttribute('name', 'eqL');
    list.push(eqL);
    const eqM = document.createElement('input');
    eqM.type = 'text';
    eqM.classList.add('eqM');
    eqM.id = 'eqM';
    eqM.setAttribute('list', 'eqMlist');
    eqM.setAttribute('name', 'eqM');
    list.push(eqM);
    const eqR = document.createElement('input');
    eqR.type = 'text';
    eqR.classList.add('eqR');
    eqR.id = 'eqR';
    eqR.addEventListener('keyup', eqRChange);
    eqR.setAttribute('list', 'eqRlist');
    eqR.setAttribute('name', 'eqR');
    list.push(eqR);
    return list;
}

function createSI() {
    const si = document.createElement('input');
    si.type = 'text';
    si.classList.add('smart-input');
    si.id = 'si-' + si_counter;
    si_counter += 1;
    si.addEventListener('keyup', siChange);
    return si;
}