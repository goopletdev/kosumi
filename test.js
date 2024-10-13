import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';

/**
 * test function
 */
async function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let outputDiv = document.getElementById('output');
    let headBreak = document.getElementById('headerBreaks').checked;
    let nodeBreak = document.getElementById('nodeBreaks').checked;
    let tree = await ParseSGF(sgf);

    console.log(JSON.stringify(tree,null,1));

    console.log('headbreak',headBreak,'nodebreak',nodeBreak);
    let newSGF = await MakeSGF(tree[0], headBreak, nodeBreak);
    console.log('newSGF:',newSGF);

    outputDiv.innerText = newSGF;

}

window.testFunctionII = testFunctionII;