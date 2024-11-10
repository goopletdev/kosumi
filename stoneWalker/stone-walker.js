/**
 * @module StoneWalker
 */

import { initBoard, initStates } from "./game-logic.js";

class StoneWalker {
    /**
     * Construct StoneWalker instance
     * @param {object} gameObject Root node of parsed SGF
     * @param {number} currentNode sets currentNode to tree node w/ given id
     */
    constructor (gameObject, currentNode=0) {
        this.currentNode = StoneWalker.getNodeById(gameObject, currentNode);
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
            let that = this;
            let node = StoneWalker.getNodeById(that.root, nodeId);
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
            let currentNode = this.currentNode;
            let newNode = StoneWalker.getNodeAtMove(currentNode);
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
            let currentNode = this.currentNode;
            currentNode = StoneWalker.getRootNode(currentNode);
            if (currentNode === -1) {
                return -1;
            } else {
                this.currentNode = currentNode;
                return this.currentNode;
            }
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
            let currentNode = this.currentNode;
            this.currentNode = StoneWalker.getTerminalNode(currentNode);
            return this.currentNode;
        }
    }

    /**
     * Searches down main branch from given node 
     * for terminal node
     * @param {*} node 
     * @returns Final node in current branch
     */
    static getTerminalNode(node) {
        if (node.hasOwnProperty('children')) {
            return this.getTerminalNode(node.children[0]);
        }
        return node;
    }

    /**
     * Searches game tree for node with given id
     * @param {*} gameTree 
     * @param {*} id 
     * @returns First node in gameTree with given id,
     * or -1 if id does not exist
     */
    static getNodeById(gameTree, id) { 
        if (gameTree.id === id) {
            return gameTree;
        } else if (!gameTree.hasOwnProperty('children')) {
            return -1;
        } else {
            for (let child of gameTree.children) {
                let node = this.getNodeById(child, id);
                if (node !== -1) {
                    return node;
                }
            }
            return -1;
        }   
    }

    /**
     * Searches up tree from node to get root node
     * @param {*} node 
     * @returns Root node
     */
    static getRootNode(node) {
        if (!node.hasOwnProperty('parent')) {
            return node;
        } else {
            return this.getRootNode(node.parent);
        }
    }

    /**
     * Searches up/down tree from given node
     * to find node with moveNumber
     * @param {*} node 
     * @param {number} moveNumber 
     * @returns First node in active branch with moveNumber
     * or -1 if it doesn't exist.
     */
    static getNodeAtMove(node, moveNumber) {
        if (node.moveNumber === moveNumber) {
            return node;
        } else if (node.moveNumber > moveNumber 
            && node.hasOwnProperty('parent')) {
            return this.getNodeAtMove(node.parent);
        } else if (node.moveNumber < moveNumber 
            && node.hasOwnProperty('children')) {
            return this.getNodeAtMove(node.children[0]);
        } else return -1;
    }
}

export default StoneWalker;