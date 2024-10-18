import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';
import {formatProps,getNodeById,getLastMainNode} from './sgf-utils.js'
import {initBoard,prettify,getState,initStates} from './game-logic.js'

let node;
let gameTree;

let oldSGF;
let newSGF;
/**
 * test function
 */

function testFunctionII() {
    let editor = document.querySelector('textarea');
    oldSGF = editor.value;
    let goban = document.getElementById('state');
    let headBreak = document.getElementById('headerBreaks').checked;
    let nodeBreak = document.getElementById('nodeBreaks').checked;
    let gameInfo = document.getElementById('game-data');


    gameTree = formatProps(ParseSGF(oldSGF)[0]);

    const EMPTY = initBoard(gameTree);
    gameTree = initStates(EMPTY,gameTree);
    node = gameTree;
    goban.innerText = prettify(node.state);

    newSGF = MakeSGF(gameTree,headBreak,nodeBreak);
    editor.value = newSGF;

    gameInfo.value = `(node ${node.id}) Move ${node.moveNumber}:\n${JSON.stringify(node.props)}`

    let toggleButton = document.getElementById('toggle-button');

    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-button';
        toggleButton.onclick = toggleSGF;
        let buttonRow = document.getElementById('sgf-buttons');
        buttonRow.appendChild(toggleButton);
    }
    toggleButton.innerText = 'show old';


}

function toggleSGF() {
    let editor = document.querySelector('textarea');
    let toggleButton = document.getElementById('toggle-button');
    if (toggleButton.innerText === 'show old') {
        toggleButton.innerText = 'show new';
        editor.value = oldSGF;
    } else {
        toggleButton.innerText = 'show old';
        editor.value = newSGF;
    }
}

function stepForeward() {
    let goban = document.getElementById('state');
    if (node.hasOwnProperty('children')) {
        let newState = getState(node.state, node.children[0].props);
        node = node.children[0];
        node.state = newState;
        goban.innerText = prettify(newState);
    }
    let gameInfo = document.getElementById('game-data');
    gameInfo.value = `(node ${node.id}) Move ${node.moveNumber}:\n${JSON.stringify(node.props)}`
}

function stepBackward() {
    let goban = document.getElementById('state');
    if (node.hasOwnProperty('parent')) {
        node = getNodeById(gameTree,node.parent);
        goban.innerText = prettify(node.state);
    }
    let gameInfo = document.getElementById('game-data');
    gameInfo.value = `(node ${node.id}) Move ${node.moveNumber}:\n${JSON.stringify(node.props)}`
}

function skipToStart() {
    let goban = document.getElementById('state');
    node = gameTree;
    goban.innerText = prettify(node.state);
    let gameInfo = document.getElementById('game-data');
    gameInfo.value = `(node ${node.id}) Move ${node.moveNumber}:\n${JSON.stringify(node.props)}`
}

function skipToEnd() {
    let goban = document.getElementById('state');
    node = getLastMainNode(node);
    console.log(node);
    goban.innerText = prettify(node.state);
    let gameInfo = document.getElementById('game-data');
    gameInfo.value = `(node ${node.id}) Move ${node.moveNumber}:\n${JSON.stringify(node.props)}`
}

window.skipToEnd = skipToEnd;
window.skipToStart = skipToStart;
window.stepBackward = stepBackward;
window.stepForeward = stepForeward;
window.testFunctionII = testFunctionII;