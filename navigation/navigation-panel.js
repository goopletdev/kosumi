import StoneWalker from "../stoneWalker/stone-walker.js";
import TextEditor from "../textEditor/text-editor.js";

class KosumiNavigation {
    constructor (parent) {
        this.parent = parent;

        this.panel = document.createElement('div');
        this.panel.classList.add('kosumiNavigationPanel');
        this.parent.appendChild(this.panel);

        this.skipBackwardButton = document.createElement('button');
        this.stepBackwardButton = document.createElement('button');
        this.stepForewardButton = document.createElement('button');
        this.skipForewardButton = document.createElement('button');
        this.skipBackwardButton.innerHTML = '<i class="fa fa-fast-backward"></i>'
        this.stepBackwardButton.innerHTML = '<i class="fa fa-step-backward"></i>'
        this.stepForewardButton.innerHTML = '<i class="fa fa-step-forward"></i>'
        this.skipForewardButton.innerHTML = '<i class="fa fa-fast-forward"></i>'
        this.skipBackwardButton.classList.add('kosumiNavigationButton');
        this.stepBackwardButton.classList.add('kosumiNavigationButton');
        this.stepForewardButton.classList.add('kosumiNavigationButton');
        this.skipForewardButton.classList.add('kosumiNavigationButton');
        this.moveNumber = document.createElement('input');
        this.moveNumber.type = 'number';
        this.moveNumber.id = 'kosumiMoveNumber';
        this.moveNumber.classList.add('kosumiMoveNumber');
        this.moveNumber.name = 'moveNumber';
        this.moveNumber.min = '0';
        this.panel.append(
            this.skipBackwardButton,
            this.stepBackwardButton,
            this.moveNumber,
            this.stepForewardButton,
            this.skipForewardButton,
        )

        this.activeNode;
    }

    setGoban(kosumiGobanObject) {
        this.goban = kosumiGobanObject; 
    }

    /**
     * 
     * @param {StoneWalker} walker 
     */
    setWalker(walker) {
        let nav = this;
        nav.walker = walker;
        this.skipBackwardButton.addEventListener('click', function() {
            walker.rootNode();
            nav.update(walker);
        });
        this.stepBackwardButton.addEventListener('click', function() {
            walker.parentNode();
            nav.update(walker);
        });
        this.stepForewardButton.addEventListener('click', function() {
            walker.firstChild();
            nav.update(walker);
        });
        this.skipForewardButton.addEventListener('click', function() {
            walker.terminalNode();
            nav.update(walker);
        });
        this.moveNumber.addEventListener('change', function() {
            walker.move(parseInt(nav.moveNumber.value));
            nav.update(walker);
        })
        this.update(walker);
    }

    /**
     * Updates navPanel's move number and goban's canvas
     * @param {StoneWalker} node 
     */
    update(walker) {
        this.goban.updateCanvas(walker.currentNode.state);
        this.moveNumber.value = walker.currentNode.moveNumber;
    }
}

export default KosumiNavigation;