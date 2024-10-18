import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';
import {formatProps,getNodeById} from './sgf-utils.js'
import {initBoard,prettify,getState} from './game-logic.js'

let node;
let gameTree;
/**
 * test function
 */
function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let output = document.getElementById('output');
    let goban = document.getElementById('state');
    let headBreak = document.getElementById('headerBreaks').checked;
    let nodeBreak = document.getElementById('nodeBreaks').checked;

    gameTree = formatProps(ParseSGF(sgf)[0]);

    const EMPTY = initBoard(gameTree);
    let firstState = getState(EMPTY,gameTree.props);
    goban.innerText = prettify(firstState);

    let newSGF = MakeSGF(gameTree,headBreak,nodeBreak);
    output.value = newSGF;

    node = gameTree;
    node.state = firstState;
}

function stepForeward() {
    let goban = document.getElementById('state');
    if (node.hasOwnProperty('children')) {
        let newState = getState(node.state, node.children[0].props);
        node = node.children[0];
        node.state = newState;
        goban.innerText = prettify(newState);
    }
}

function stepBackward() {
    let goban = document.getElementById('state');
    if (node.hasOwnProperty('parent')) {
        node = getNodeById(gameTree,node.parent);
        goban.innerText = prettify(node.state);
    }
}

window.stepBackward = stepBackward;
window.stepForeward = stepForeward;
window.testFunctionII = testFunctionII;