import ParseSGF from './parse-sgf.js';
import MakeSGF from './make-sgf.js';
import {formatProps,getNodeById} from './sgf-utils.js'
import {initBoard,prettify,getState} from './game-logic.js'

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


    gameTree = formatProps(ParseSGF(oldSGF)[0]);

    const EMPTY = initBoard(gameTree);
    let firstState = getState(EMPTY,gameTree.props);
    goban.innerText = prettify(firstState);

    newSGF = MakeSGF(gameTree,headBreak,nodeBreak);
    editor.value = newSGF;

    node = gameTree;
    node.state = firstState;

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