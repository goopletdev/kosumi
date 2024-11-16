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

        this.activeNode;
    }

    /**
     * Assigns listeners to this's buttons that interact with walker
     * @param {StoneWalker} walker 
     */
    set walker(walker) {
        this._walker = walker;
        lazy.listen(this.skipBackwardButton,'click',() => {
            walker.rootNode();
            walker.update();
        });
        lazy.listen(this.stepBackwardButton,'click',() => {
            walker.parentNode();
            walker.update();
        });
        lazy.listen(this.stepForewardButton,'click',() => {
            walker.firstChild();
            walker.update();
        });
        lazy.listen(this.skipForewardButton,'click',() => {
            walker.terminalNode();
            walker.update();
        });
        lazy.listen(this.moveNumber,'change',() => {
            let newMoveNum = parseInt(this.moveNumber.value);
            walker.move(newMoveNum);
            walker.update();
        });
    }

    /**
     * Updates navPanel's move number and goban's canvas
     * @param {StoneWalker} walker 
     */
    set update(walker) {
        this.moveNumber.value = walker.currentNode.moveNumber;
    }
}

export default NavPanel;