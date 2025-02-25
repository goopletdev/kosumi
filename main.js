import TextEditor from './textEditor/text-editor.js';
import GobanViewer from './goban/goban-viewer.js';
import StoneWalker from './stoneWalker/stone-walker.js';
import GameEngine from './stoneWalker/game-engine-class.js';
import GobanPlayer from './goban/goban-player.js';

document.addEventListener('DOMContentLoaded',() => {
    const engine = new GameEngine(19,19);
    document.fonts.ready.then(() => {
        const goban = new GobanViewer(19,19,'A1',3,3);
        document.getElementById('gobanParent').append(goban.domElement);
        goban.resize.observe(goban.domElement.parentElement);

        const player = new GobanPlayer(goban,engine,4);
        player.toolPanel = document.getElementById('navigationParent');
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