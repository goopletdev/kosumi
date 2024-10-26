import TextEditor from './textEditor/text-editor.js';
import KosumiGoban from './goban/goban.js';
import ParseSGF from './sgfStuff/parse-sgf.js';
import MakeSGF from './sgfStuff/make-sgf.js';
import {formatProps,getNodeById,getLastMainNode} from './sgfStuff/sgf-utils.js';
import {initBoard,initStates,getState} from './sgfStuff/game-logic.js';

const texteditor =  new TextEditor(document.getElementById('editorParent'));
const goban = new KosumiGoban(document.getElementById('gobanParent'));

goban.activeNode;
goban.gameTree;
goban.getNodeById = getNodeById;
goban.getState = getState;
goban.getLastMainNode = getLastMainNode;

let oldSGF;
let newSGF;

const toggleSGF = () => {
    let toggleButton = document.getElementById('toggleButton');
    if (toggleButton.innerText === 'show old SGF') {
        toggleButton.innerText = 'show new SGF';
        texteditor.textarea.value = oldSGF;
    } else {
        toggleButton.innerText = 'show old SGF';
        texteditor.textarea.value = newSGF;
    }
    texteditor.update();
}

const lezgooo = () => {
    oldSGF = texteditor.textarea.value;
    goban.boardState;
    let headBreak = true;
    let nodeBreak = true;
    goban.info;

    goban.gameTree = formatProps(ParseSGF(oldSGF)[0]);

    const EMPTY = initBoard(goban.gameTree);
    goban.gameTree = initStates(EMPTY,goban.gameTree);

    goban.activeNode = goban.gameTree;

    if (goban.displayStyle === 'html') {
        goban.boardState.innerHTML = KosumiGoban.asciiHTML(goban.activeNode.state);
    } else if (goban.displayStyle === 'ascii') {
        goban.boardState.innerText = KosumiGoban.ascii(goban.activeNode.state);
    } else if (goban.displayStyle === 'canvas') {
        KosumiGoban.paint(goban.boardState,goban.activeNode.state);
    }

    newSGF = MakeSGF(goban.gameTree, headBreak, nodeBreak);
    texteditor.textarea.value = newSGF;
    texteditor.update();

    goban.info.value = `(node ${goban.activeNode.id}) Move ${goban.activeNode.moveNumber}:\n${JSON.stringify(goban.activeNode.props)}`;

    let toggleButton = document.getElementById('toggleButton');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.addEventListener('click', toggleSGF);
        document.getElementById('settings').appendChild(toggleButton);
    }
    toggleButton.innerText = 'show old SGF';

}

const toggleDisplayStyle = () => {
    goban.container.removeChild(goban.boardState);
    if (goban.displayStyle === 'html') {
        goban.displayStyle = 'canvas';

        goban.boardState = document.createElement('canvas');
        goban.boardState.height = '400';
        goban.boardState.width = '400';
        goban.boardState.id = 'kosumiCanvas';
        goban.boardState.classList.add('gobanCanvas');
        goban.container.insertBefore(goban.boardState,goban.container.firstChild);
        KosumiGoban.paint(goban.boardState,goban.activeNode.state);
        return;
    } else if (goban.displayStyle === 'canvas') {
        goban.displayStyle = 'ascii';
    } else if (goban.displayStyle === 'ascii') {
        goban.displayStyle = 'html';
    }
    goban.boardState = document.createElement('pre');
    goban.boardState.classList.add('gobanBoardState');
    goban.boardState.innerText = KosumiGoban.placeholder;
    goban.container.insertBefore(goban.boardState,goban.container.firstChild);

    if (goban.displayStyle === 'html') {
        goban.boardState.innerHTML = KosumiGoban.asciiHTML(goban.activeNode.state);
    } else if (goban.displayStyle === 'ascii') {
        goban.boardState.innerText = KosumiGoban.ascii(goban.activeNode.state);
    }
}

document.getElementById('parse').addEventListener('click',lezgooo);
document.getElementById('toggle-display').addEventListener('click',toggleDisplayStyle);