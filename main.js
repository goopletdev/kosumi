import TextEditor from './textEditor/text-editor.js';
import GobanCanvas from './goban/goban.js';
import KosumiNavigation from './navigation/navigation-panel.js';
import KosumiNodeInfo from './nodeInfo/node-info.js';
import StoneWalker from './stone-walker.js';
import SGF from './sgf/sgf-handler.js';

const texteditor =  new TextEditor(document.getElementById('editorParent'));
const goban = new GobanCanvas(document.getElementById('gobanParent'));
const navigationPanel = new KosumiNavigation(document.getElementById('navigationParent'));
const infoPanel = new KosumiNodeInfo(document.getElementById('infoParent'));

navigationPanel.setGoban(goban);
navigationPanel.setInfo(infoPanel);

let oldSGF;
let newSGF;
let gameTree = {currentNode: {id: 0}};
let collection;

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

const updateDisplay = () => {
    collection = SGF.parse(texteditor.textarea.value);
    gameTree = new StoneWalker(collection[0], gameTree.currentNode.id);
    navigationPanel.setWalker(gameTree);
}

const lezgooo = () => {
    oldSGF = texteditor.textarea.value;
    collection = SGF.parse(oldSGF);
    gameTree = new StoneWalker(collection[0], gameTree.currentNode.id);
    navigationPanel.setWalker(gameTree);

    newSGF = SGF.encode(gameTree.root);
    texteditor.textarea.value = newSGF;
    texteditor.update();

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
texteditor.textarea.addEventListener('change', updateDisplay);
texteditor.textarea.addEventListener('input',updateDisplay);


// splitBar resizer
let splitBar = document.getElementById('splitBar');
let mouseIsDown = false;

splitBar.addEventListener('mousedown', function() {
    mouseIsDown = true;
})
document.addEventListener('mouseup', function () {
    mouseIsDown = false;
    // handle moving caret
    if (gameTree.currentNode.id !== texteditor.activeNode) {
        gameTree.id(texteditor.activeNode);
        navigationPanel.update(gameTree.currentNode);
    }
})
document.addEventListener('mousemove', function (mousePosition) {
    if (!mouseIsDown) return;
    let splitBarStyle = splitBar.getBoundingClientRect()
    let splitBarWidth = splitBarStyle.right-splitBarStyle.left;
    texteditor.parent.style.width = `${mousePosition.clientX - texteditor.parent.getBoundingClientRect().left - (splitBarWidth/2)}px`;    
})
