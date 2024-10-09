import ParseSGF from './parse-sgf.js';
/**
 * test function
 */
function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let outputDiv = document.getElementById('output');
    let printTree = JSON.stringify(ParseSGF(sgf),null,1);
    console.log(printTree);
    outputDiv.innerText = printTree;
}

window.testFunctionII = testFunctionII;