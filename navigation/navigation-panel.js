/**
 * @module NavPanel
 */

import StoneWalker from "../stoneWalker/stone-walker.js";
import * as lazy from '../lazy-dom.js';

class NavPanel {
    constructor (parent) {
        this.parent = parent;

        this.panel = lazy.div('kosumiNavigationPanel',this.parent);
        this.skipBackwardButton = lazy.button('kosumiNavigationButton',this.panel,null,'<<');
        this.stepBackwardButton = lazy.button('kosumiNavigationButton',this.panel,null,'<');
        this.moveNumber = lazy.inputNum('moveNumber','0',null,'kosumiMoveNumber',this.panel,'kosumiMoveNumber');
        this.stepForewardButton = lazy.button('kosumiNavigationButton',this.panel,null,'>');
        this.skipForewardButton = lazy.button('kosumiNavigationButton',this.panel,null,'>>');
    }

    /**
     * Assigns listeners to this's buttons that interact with walker
     * @param {StoneWalker} walker 
     */
    set walker(walker) {
        this._walker = walker;
        this.skipBackwardButton.addEventListener('click',() => {
            walker.rootNode();
            walker.update();
        });
        this.stepBackwardButton.addEventListener('click',() => {
            walker.parentNode();
            walker.update();
        });
        this.stepForewardButton.addEventListener('click',() => {
            walker.firstChild();
            walker.update();
        });
        this.skipForewardButton.addEventListener('click',() => {
            walker.terminalNode();
            walker.update();
        });
        this.moveNumber.addEventListener('change',(e) => {
            walker.move(parseInt(e.target.value));
            walker.update();
        });
    }

    /**
     * Updates navPanel's move number and goban's canvas
     */
    update() {
        this.moveNumber.value = this._walker.currentNode.moveNumber;
    }
}

export default NavPanel;