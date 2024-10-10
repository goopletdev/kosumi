import ParseSGF from './parse-sgf.js';
/**
 * test function
 */
async function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let outputDiv = document.getElementById('output');
    let printTree = JSON.stringify(await ParseSGF(sgf),null,1);
    console.log(printTree);
    outputDiv.innerText = printTree;
}

window.testFunctionII = testFunctionII;