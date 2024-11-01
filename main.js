import TextEditor from './textEditor/text-editor.js';
import KosumiGoban from './goban/goban.js';
import KosumiNavigation from './navigation/navigation-panel.js';
import ParseSGF from './sgfStuff/parse-sgf.js';
import MakeSGF from './sgfStuff/make-sgf.js';
import {formatProps,getNodeById,getLastMainNode} from './sgfStuff/sgf-utils.js';
import {initBoard,initStates,getState} from './sgfStuff/game-logic.js';

const texteditor =  new TextEditor(document.getElementById('editorParent'));
const goban = new KosumiGoban(document.getElementById('gobanParent'));
const navigationPanel = new KosumiNavigation(document.getElementById('gobanParent'));
goban.activeNode;
goban.gameTree;
goban.getNodeById = getNodeById;
goban.getState = getState;
goban.getLastMainNode = getLastMainNode;


navigationPanel.setGoban(goban);

let oldSGF;
let newSGF;
let gameTree;

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

    gameTree = formatProps(ParseSGF(oldSGF)[0]);

    const EMPTY = initBoard(gameTree);
    gameTree = initStates(EMPTY,gameTree);

    navigationPanel.activeNode = gameTree;

    KosumiGoban.paint(goban.boardState,navigationPanel.activeNode.state);

    newSGF = MakeSGF(gameTree, headBreak, nodeBreak);
    texteditor.textarea.value = newSGF;
    texteditor.update();

    navigationPanel.info.value = `(node ${navigationPanel.activeNode.id}) Move ${navigationPanel.activeNode.moveNumber}:\n${JSON.stringify(navigationPanel.activeNode.props)}`;

    let toggleButton = document.getElementById('toggleButton');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.classList.add('editorButton');
        toggleButton.addEventListener('click', toggleSGF);
        texteditor.toolbar.appendChild(toggleButton);
    }
    toggleButton.innerText = 'show old SGF';

}

document.getElementById('format').addEventListener('click',lezgooo);