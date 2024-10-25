import TextEditor from './textEditor/text-editor.js';
import KosumiGoban from './goban/goban.js';
import ParseSGF from './sgfStuff/parse-sgf.js';
import MakeSGF from './sgfStuff/make-sgf.js';
import {formatProps,getNodeById,getLastMainNode} from './sgfStuff/sgf-utils.js';
import {initBoard,prettify,initStates,getState} from './sgfStuff/game-logic.js';

const texteditor =  new TextEditor(document.getElementById('editorParent'));
const goban = new KosumiGoban(document.getElementById('gobanParent'));

goban.activeNode;
goban.gameTree;
goban.prettify = prettify;
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
    goban.boardState.innerText = prettify(goban.activeNode.state);

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

document.getElementById('parse').addEventListener('click',lezgooo);
