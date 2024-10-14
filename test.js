import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';
import {formatProps} from './sgf-utils.js'
import Goban from './goban.js'

/**
 * test function
 */
async function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let output = document.getElementById('output');
    let headBreak = document.getElementById('headerBreaks').checked;
    let nodeBreak = document.getElementById('nodeBreaks').checked;

    console.log(sgf);
    let gameTree = await ParseSGF(sgf);
    console.log(JSON.stringify(gameTree,null,2));
    gameTree = await formatProps(gameTree[0]);
    console.log(JSON.stringify(gameTree,null,2));

    let newSGF = await MakeSGF(gameTree,headBreak,nodeBreak);
    console.log(newSGF);
    output.value = newSGF;



    /*let game = new Goban;
    game.parse(sgf)
    .then(() => {
        console.log(JSON.stringify(game.tree,null,2));
        game.formatTree();
    })
    .then(() => {
        game.getSGF(headBreak,nodeBreak);
        console.log(JSON.stringify(game.tree));
        console.log(game.sourceSGF);
    })
    .then(() => {
        console.log(game.sgf);
        output.value = game.sgf;
    });*/

}

window.testFunctionII = testFunctionII;