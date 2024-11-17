import TextEditor from './textEditor/text-editor.js';
import GobanCanvas from './goban/goban.js';
import NavPanel from './navigation/navigation-panel.js';
import StoneWalker from './stoneWalker/stone-walker.js';

document.addEventListener('DOMContentLoaded',() => {
    const texteditor =  new TextEditor(document.getElementById('editorParent'));
    const navigator = new NavPanel(document.getElementById('navigationParent'));
    const goban = new GobanCanvas(document.getElementById('gobanParent'));
    const walker = new StoneWalker();
    
    // connect display and StoneWalker objects
    walker.join(goban, navigator, texteditor);

    // splitBar resizer
    document.getElementById('splitBar').addEventListener('mousedown', () => {
        function splitBarMove(cursor) {
            let barStyle = splitBar.getBoundingClientRect();
            let barWidth = barStyle.right-barStyle.left;
            let leftEditorBounds = texteditor.parent.getBoundingClientRect().left;
            let width = cursor.clientX - leftEditorBounds - (barWidth/2)
            texteditor.parent.style.width = `${width}px`
        }
        document.addEventListener('mousemove', splitBarMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove',splitBarMove)
        })
    });
})