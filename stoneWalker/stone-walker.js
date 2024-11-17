/**
 * @module StoneWalker
 */

import { initBoard, initStates } from "./game-logic.js";
import * as mosey from "./sw-private-functions.js";
import { propertyDefinitions } from "../sgf/sgfProperties.js";

class StoneWalker {
    /**
     * Construct StoneWalker instance with default contents
     */
    constructor () {
        this.currentNode = {
            id: 0,
            props: {
                FF: '4',
                AP: 'Kosumi:0.1.0',
            }
        };

        this.collection = [];

        // array of objects to update;
        this._updateObjects = []
    }

    update() {
        for (let obj of this._updateObjects) {
            obj.update();
        }
    }

    /**
     * Checks whether given intersection is currently occupied.
     * @param {[number,number]} coordinates 
     * @returns {boolean}
     */
    intersectionIsOccupied(coordinates) {
        return this.currentNode.state[coordinates[1]][coordinates[0]] !== '.';
    }

    /**
     * Takes any number of objects as arguments. 
     * Each object must have an update() function
     * And a set walker() function
     */
    join() {
        [...arguments].forEach(arg => {
            arg.walker = this;
            this._updateObjects.push(arg);
        });
    }

    /**
     * @param {object} gameObject
     */
    set game(gameObject) {
        let currentNodeId = this.currentNode.id;
        this.currentNode = mosey.getNodeById(gameObject, currentNodeId)
        this.EMPTY = initBoard(gameObject);
        this.root = initStates(this.EMPTY, gameObject);
        if (this.root.props.hasOwnProperty('AP')) {
            // log previous apps to help fix style errors 
            this.previousApps = this.root.props.AP;
        }
        this.root.props.AP = [propertyDefinitions.AP.kosumiDefault];
    }

    /**
     * Searches tree for node with given id and sets currentNode to that id
     * @param {number} nodeId 
     * @returns New current node, or -1 if the node doesn't exist or the 
     * currentNode already has that id
     */
    id(nodeId) {
        if (this.currentNode.id === nodeId) {
            return -1;
        } else {
            let node = mosey.getNodeById(this.root, nodeId);
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
            let newNode = mosey.getNodeAtMove(this.currentNode, moveNumber);
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
            this.currentNode = mosey.getRootNode(this.currentNode);
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
            this.currentNode = mosey.getTerminalNode(this.currentNode);
            return this.currentNode;
        }
    }

}

export default StoneWalker;