/**
 * @module StoneWalker
 */

import { initBoard, initStates } from "./game-logic.js";
import * as priv from "./sw-private-functions.js";

class StoneWalker {
    /**
     * Construct StoneWalker instance
     * @param {object} gameObject Root node of parsed SGF
     * @param {number} currentNode sets currentNode to tree node w/ given id
     */
    constructor (gameObject, currentNode=0) {
        this.currentNode = priv.getNodeById(gameObject, currentNode);
        this.EMPTY = initBoard(gameObject);
        this.root = initStates(this.EMPTY, gameObject);
    }

    /**
     * 
     * @param {number} nodeId 
     * @returns 
     */
    id(nodeId) {
        if (this.currentNode.id === nodeId) {
            return -1;
        } else {
            let node = priv.getNodeById(this.root, nodeId);
            if (node !== -1) {
                this.currentNode = node;
            }
            return node;
        }
    }

    /**
     * Sets currentNode to node in current branch at moveNumber
     * @param {number} moveNumber 
     * @returns New currentNode, or -1 if the current node already
     * has that moveNumber or if that node does not exist
     */
    move(moveNumber) {
        if (this.currentNode.moveNumber === moveNumber) {
            return -1;
        } else {
            let newNode = priv.getNodeAtMove(this.currentNode);
            if (newNode !== -1) {
                this.currentNode = newNode;
                return this.currentNode;
            } else {
                return -1;
            }
        }
    }

    /**
     * Sets currentNode to root node
     * @returns {object} New currentNode, or -1 if already root
     */
    rootNode() {
        if (this.currentNode.hasOwnProperty('parent')) {
            this.currentNode = priv.getRootNode(this.currentNode);
            return this.currentNode;
        } else {
            return -1;
        }
    }

    /**
     * Sets currentNode to parent
     * @returns New currentNode, or -1 if orphan node
     */
    parentNode() {
        if (this.currentNode.hasOwnProperty('parent')) {
            this.currentNode = this.currentNode.parent;
            return this.currentNode;
        }
        return -1;
    }

    /**
     * Sets currentNode to last child
     * @returns New currentNode, or -1 if childless
     */
    lastChild() {
        if (this.currentNode.hasOwnProperty('children')) {
            let last = this.currentNode.children.length-1;
            this.currentNode = this.currentNode.children[last];
            return this.currentNode;
        }
        return -1;
    }

    /**
     * Sets currentNode to first child
     * @returns New currentNode, or -1 if childless
     */
    firstChild() {
        if (this.currentNode.hasOwnProperty('children')) {
            this.currentNode = this.currentNode.children[0];
            return this.currentNode;
        }
        return -1;
    }

    /**
     * Sets currentNode to previous sibling
     * @returns New currentNode, or -1 if only child
     */
    previousSibling() {
        if (this.currentNode.hasOwnProperty('parent')) {
            let siblings = this.currentNode.parent.children;
            let currentNode = this.currentNode;
            let currentChildIndex = siblings.indexOf(currentNode);
            if (siblings.length > 1 && currentChildIndex > 0) {
                this.currentNode = siblings[currentChildIndex-1];
                return this.currentNode;
            }
        }
        return -1;
    }

    /**
     * Sets currentNode to next sibling
     * @returns New currentNode, or -1 if only child
     */
    nextSibling() {
        if (this.currentNode.hasOwnProperty('parent')) {
            let siblings = this.currentNode.parent.children;
            let currentNode = this.currentNode;
            let currentChildIndex = siblings.indexOf(currentNode);
            if (siblings.length > 1 
                && currentChildIndex < siblings.length-1) {
                this.currentNode = siblings[currentChildIndex+1];
                return this.currentNode;
            }
        }
        return -1;
    }

    /**
     * Sets currentNode to final main node in current branch
     * @returns New currentNode, or -1 if currentNode is childless
     */
    terminalNode() {
        if (!this.currentNode.hasOwnProperty('children')) {
            return -1;
        } else {
            this.currentNode = priv.getTerminalNode(this.currentNode);
            return this.currentNode;
        }
    }

}

export default StoneWalker;