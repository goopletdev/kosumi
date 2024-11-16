// NODE EDITING FUNCTIONS
// create new node
// insert node before
// insert node as child
// delete node
// edit move (for node with single move)
// invert colors
// markup

// NODE NAVIGATION METHODS

/**
 * Searches down main branch from given node 
 * for terminal node
 * @param {*} node 
 * @returns Final node in current branch
 */
function getTerminalNode(node) {
    if (node.hasOwnProperty('children')) {
        return getTerminalNode(node.children[0]);
    }
    return node;
}

/**
 * Searches game tree for node with given id
 * @param {*} gameTree 
 * @param {number} id 
 * @returns First node in gameTree with given id,
 * or -1 if id does not exist
 */
function getNodeById(gameTree, id) { 
    if (gameTree.id === id) {
        return gameTree;
    } else if (!gameTree.hasOwnProperty('children')) {
        return -1;
    } else {
        for (let child of gameTree.children) {
            let node = getNodeById(child, id);
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
function getRootNode(node) {
    if (!node.hasOwnProperty('parent')) {
        return node;
    } else {
        return getRootNode(node.parent);
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
function getNodeAtMove(node, moveNumber) {
    if (node.moveNumber === moveNumber) {
        return node;
    } else if (node.moveNumber > moveNumber && node.hasOwnProperty('parent')) {
        return getNodeAtMove(node.parent, moveNumber);
    } else if (node.moveNumber < moveNumber && node.hasOwnProperty('children')) {
        return getNodeAtMove(node.children[0], moveNumber);
    } else return -1;
}

export { getNodeAtMove, getNodeById, getRootNode, getTerminalNode }