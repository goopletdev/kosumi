import TextEditor from './textEditor/text-editor.js';
import GobanCanvas from './goban/goban-canvas.js';
import NavPanel from './navigation/navigation-panel.js';
import StoneWalker from './stoneWalker/stone-walker.js';

document.addEventListener('DOMContentLoaded',() => {
    document.fonts.ready.then(() => {
        const goban = new GobanCanvas(19,19,document.getElementById('gobanParent'));
        goban.toolPanel = document.getElementById('navigationParent');    
    });

    // splitBar resizer
    document.getElementById('splitBar').addEventListener('mousedown', () => {
        function splitBarMove(cursor) {
            const textEditorParent = document.getElementById('editorParent');
            const barStyle = splitBar.getBoundingClientRect();
            const barWidth = barStyle.right-barStyle.left;

            const leftEditorBounds = textEditorParent.getBoundingClientRect().left;
            const width = cursor.clientX - leftEditorBounds - (barWidth/2)
            textEditorParent.style.width = `${width}px`;
        }
        document.addEventListener('mousemove', splitBarMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove',splitBarMove)
        });
    });
})