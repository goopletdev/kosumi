import TextEditor from './textEditor/text-editor.js';
import GobanCanvas from './goban/goban.js';
import KosumiNavigation from './navigation/navigation-panel.js';
import StoneWalker from './stoneWalker/stone-walker.js';
import * as lazy from './lazy-dom.js';

const texteditor =  new TextEditor(document.getElementById('editorParent'));
const goban = new GobanCanvas(document.getElementById('gobanParent'));
const navPanel = new KosumiNavigation(document.getElementById('navigationParent'));
const walker = new StoneWalker();

walker.drive(goban, navPanel);
navPanel.walker = walker;
texteditor.walker = walker;

// splitBar resizer
let splitBar = document.getElementById('splitBar');
let mouseIsDown = false;
lazy.listen(splitBar,'mousedown',() => mouseIsDown = true);
lazy.listen(document,'mouseup',() => mouseIsDown = false);

document.addEventListener('mousemove', function (mousePosition) {
    if (!mouseIsDown) return;
    let splitBarStyle = splitBar.getBoundingClientRect()
    let splitBarWidth = splitBarStyle.right-splitBarStyle.left;
    texteditor.parent.style.width = `${mousePosition.clientX - texteditor.parent.getBoundingClientRect().left - (splitBarWidth/2)}px`;    
})
