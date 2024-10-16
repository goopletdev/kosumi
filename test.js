import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';
import {formatProps} from './sgf-utils.js'
import {initBoard,matrix,prettify,getState,treeStates,EMPTY} from './game-logic.js'

let node;
/**
 * test function
 */
function testFunctionII() {
    let sgf = document.querySelector('textarea').value;
    let output = document.getElementById('output');
    let goban = document.getElementById('state');
    let headBreak = document.getElementById('headerBreaks').checked;
    let nodeBreak = document.getElementById('nodeBreaks').checked;

    let gameTree = formatProps(ParseSGF(sgf)[0]);

    initBoard(gameTree);
    let firstState = getState(EMPTY,gameTree.props);
    goban.innerText = prettify(firstState);

    let newSGF = MakeSGF(gameTree,headBreak,nodeBreak);
    output.value = newSGF;

    //gameTree = treeStates(gameTree, EMPTY);
    node = gameTree;
    node.state = firstState;
}

function stepForeward() {
    let goban = document.getElementById('state');
    let newState = getState(node.state, node.children[0].props);
    node = node.children[0];
    node.state = newState;
    goban.innerText = prettify(newState);

}

window.stepForeward = stepForeward;
window.testFunctionII = testFunctionII;