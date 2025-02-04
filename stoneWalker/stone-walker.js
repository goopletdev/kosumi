/**
 * @module StoneWalker
 */

import GameEngine from './game-engine-class.js';
import * as mosey from "./sw-private-functions.js";
import { propertyDefinitions } from "../sgf/sgfProperties.js";

class StoneWalker {
    /**
     * Construct StoneWalker instance with default contents
     */
    constructor (goban = new GameEngine()) {
        Object.assign(this,goban);
    }

    /**
     * Runs .update() for each joined object
     */
    update() {
        for (let obj of this._joinedObjects) {
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
     * Get value at intersection
     * @param {[number,number]} coordinates 
     * @returns {string}
     */
    valueAtIntersection(coordinates) {
        return this.currentNode.state[coordinates[1]][coordinates[0]]
    }


    /**
     * Find node in tree with given coordinate
     * @param {[number,number]} coordinates 
     * @returns {object | -1}
     */
    getNodeAtCoordinate(coordinates) {
        let lastNodeWithCoord = mosey.getLastNodeAtCoordinate(this.currentNode, coordinates);
        if (lastNodeWithCoord === this.currentNode) {
            return -1;
        } else if (lastNodeWithCoord === -1) {
            let nextNodeWithCoord = mosey.getNextNodeAtCoordinate(this.currentNode, coordinates);
            if (nextNodeWithCoord === -1) {
                return -1;
            } else {
                this.currentNode = nextNodeWithCoord;
                return this.currentNode;
            }
        } else {
            this.currentNode = lastNodeWithCoord;
            return this.currentNode;
        }
    }

    referenceNodeAtCoordinate(coordinate) {
        let lastNodeWithCoord = mosey.getLastNodeAtCoordinate(this.currentNode,coordinate);
        if (lastNodeWithCoord === -1) {
            let nextNodeWithCoord = mosey.getNextNodeAtCoordinate(this.currentNode,coordinate);
            if (nextNodeWithCoord === -1) return -1;
            else return nextNodeWithCoord;
        } else return lastNodeWithCoord;
    }

    editCoordinate(referenceNode, startingCoord, targetCoord) {
        let stringifiedCoordinate = JSON.stringify(startingCoord);
        for (let key of ['B','W','AB','AW']) {
            if (referenceNode.props.hasOwnProperty(key)) {
                for (let coord of referenceNode.props[key]) {
                    if (JSON.stringify(coord) === stringifiedCoordinate) {
                        console.log(key,coord,stringifiedCoordinate)
                        coord[0] = targetCoord[0];
                        coord[1] = targetCoord[1];
                        console.log(referenceNode);
                    }
                }
            }
        }
        this.root = initStates(this.EMPTY,this.root);
    } 

    /**
     * Takes any number of objects as arguments. 
     * Each object must have an update() function
     * And a set walker() function
     */
    join() {
        [...arguments].forEach(arg => {
            arg.walker = this;
            this._joinedObjects.push(arg);
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