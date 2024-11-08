/**
 * @module game-logic
 */

import SGF from "./sgf-handler.js";

//import {SGFHandler.numericCoord} from './sgf-utils.js';


/**
 * Gets array of unoccupied intersections adjacent to chain's coords
 * @param {matrix} matrix Boardstate
 * @param {[]} chain Chain of stones
 * @returns {[]} array of chain's liberties
 */
function getLiberties(matrix, chain) {
    let liberties = [];
    for (let link of chain) {
        for (let point of neighbors(matrix,link)) {
            if (!arrayHasCoord(liberties,point) 
                && getValue(matrix,point) === '.') {
                liberties.push(point);
            }
        }
    }
    return liberties;
}

/**
 * Returns value at coordinate
 * @param {matrix} matrix Boardstate
 * @param {[number,number]} coord Numeric coordinate
 * @returns {string} value at coordinate
 */
function getValue(matrix,coord) {
    return matrix[coord[1]][coord[0]];
}

/**
 * Sets value of boardstate at coordinate
 * @param {matrix} matrix boardstate
 * @param {[number,number]} coord Numeric coordinate
 * @param {string} value 'B','W','b','w',etc
 * @returns {matrix} Mutated matrix
 */
function setValue(matrix,coord,value) {
    matrix[coord[1]][coord[0]] = value;
    return matrix;
}

/**
 * Returns array of orthogonally adjacent coordinates to a given coordinate
 * Useful for finding legal coordinates given a coord on edge or corner
 * @param {matrix} matrix Boardstate
 * @param {[number,number]} coord Coordinate whose adjacent coords you seek
 * @returns {array} of adjacent coordinates
 */
function neighbors(matrix,coord) {
    let [x,y] = coord;
    let adjacent = [];
    for (let candidate of [[x,y+1],[x,y-1],[x+1,y],[x-1,y]]) {
        let [xx,yy] = candidate;
        if (matrix[yy]!== undefined) {
            if (matrix[yy][xx] !== undefined) {
                adjacent.push(candidate);
            }
        }
    }
    return adjacent;
}

/**
 * Finds friendly neighbors; 'links' of a chain
 * @param {matrix} matrix Boardstate
 * @param {[number,number]} coord Numeric coordinate
 * @returns {array} of adjacent stones that share a color w/ given coord
 */
function adjacentLinks(matrix,coord) {
    let chainColor = getValue(matrix,coord);
    let adjacent = neighbors(matrix,coord);
    let links = [];
    for (let c of adjacent) {
        if (getValue(matrix,c) === chainColor) {
            links.push(c);
        }
    }
    return links;
}

/**
 * Checks whether given chain of stones contains a stone at a given coordinate
 * @param {[number,number][]} chain Array of coordinates in number,number form
 * @param {[number,number]} coord Coordinate in number form
 * @returns {boolean} true if the chain contains the coordinate, false otherwise
 */
function arrayHasCoord(chain,coord) {
    for (let link of chain) {
        if (link[0] === coord[0] && link[1] === coord[1]) {
            return true;
        }
    }
    return false;
}

function getChain(goban,coord,chain=[]) {
    if (!arrayHasCoord(chain,coord)) {
        chain.push(coord);
    }
    for (let link of adjacentLinks(goban,coord)) {
        if (!arrayHasCoord(chain,link)) {
            chain = getChain(goban,link,chain);
        }
    }
    return chain;
}

/**
 * Checks whether given array of chains contains a stone at a given coordinate
 * @param {Array} chains array of [number,number] coordinates
 * @param {[number,number]} coord coordinate to check for
 * @returns true if array of chains includes coordinate, false otherwise
 */
function coordInChains(chains,coord) {
    for (let chain of chains) {
        if (arrayHasCoord(chain,coord)) {
            return true;
        }
    }
    return false;
}

/**
 * Indicates newmove by setting move toLowerCase()
 * @param {matrix} state Boardstate
 * @param {[number,number][]} move 
 * @returns Boardstate with lowercase newMoves
 */
function setNew(state,move) {
    let lower = getValue(state,move).toLowerCase();
    state = setValue(state,move,lower);
    return state;
}

/**
 * Applies game logic to boardstate and new moves
 * @param {matrix} state Previous boardstate
 * @param {[number,number][]} moves Array of numeric coordinates
 * @returns new boardstate
 */
function calculateBoard(state,moves) {
    let newState = clone(state);
    let checkpoints = moves.slice(1);
    for (let move of moves.slice(1)) {
        newState[move[1]][move[0]] = moves[0];
        setValue(newState,move,moves[0])

        for (let point of neighbors(newState,move)) {
            let value = getValue(newState,point);
            if (value === moves[0]) {
                checkpoints.push(point);
            } else if (value !== '.') {
                checkpoints.unshift(point);
            }
        }
    }

    let chains = [];
    for (let point of checkpoints) {
        if (!coordInChains(chains,point)) {
            chains.push(getChain(newState,point));
        }
    }

    for (let chain of chains) {
        let liberties = getLiberties(newState,chain);
        if (liberties.length < 1) {
            for (let point of chain) {
                newState[point[1]][point[0]] = '.';
            }
        }
    }
    for (let move of moves.slice(1)) {
        newState = setNew(newState,move);
    }
    return newState;
}

/**
 * Generates boardstate by placing moves on parent boardstate
 * @param {matrix} lastState Boardstate at parent node
 * @param {object} props Node properties
 * @returns {matrix} new boardstate
 */
function getState(lastState,props) {
    let newState = clone(lastState);
    for (let key of Object.keys(props)) {
        if (['AB','AE','AW'].includes(key)) {
            let point = key[1];
            if (point === 'E') {
                point = '.';
            }
            for (let i=0; i<props[key].length; i++) {
                let newCoord = SGF.numericCoord(props[key][i]);
                newState[newCoord[1]][newCoord[0]] = point;
            }
        } else if (['B','W'].includes(key) && props[key][0].length>0) {
            let moves = [key];
            for (let move of props[key]) {
                moves.push(SGF.numericCoord(move));
            }
            newState = calculateBoard(lastState,moves);
        }
    }
    return newState;
}

/**
 * Generates board state for node and its children
 * @param {matrix} lastState Game state at parent node
 * @param {object} gameTree Target node to generate board state
 * @returns {object} gameTree with node's state
 */
function initStates(lastState, gameTree) {
    if (gameTree.hasOwnProperty('props')) {
        gameTree.state = getState(lastState,gameTree.props);
    } else {
        gameTree.state = lastState;
    }
    if (gameTree.hasOwnProperty('children')) {
        for (let child of gameTree.children) {
            child = initStates(gameTree.state,child);
        }
    }
    return gameTree;
}

/**
 * Generates deep clone of given boardstate
 * @param {matrix} board Boardstate
 * @param {boolean} keepCase Maintain case sensitivity
 * @returns {matrix} deep clone of boardstate
 */
function clone(board,keepCase=false) {
    let goban = [];
    for (let row of board) {
        if (!keepCase) {
            goban.push(Array.from(
                row.slice(0),(x) => x.toUpperCase()
            ));
        } else goban.push(row.slice(0));
    }
    return goban;
}

/**
 * Initializes empty board matrix
 * @param {object} rootNode Root node of gameTree; if 
 * it doesn't have property SZ, defaults to 19.
 * @returns empty board matrix
 */
function initBoard(rootNode) {
    let EMPTY = [];
    let X,Y;
    if (rootNode.id === 0) {
        if (!rootNode.hasOwnProperty('props')) {
            rootNode.props.SZ = ['19'];
        } else if (!rootNode.props.hasOwnProperty('SZ')) {
            rootNode.props.SZ = ['19'];
        }
        if (rootNode.props.SZ[0].includes(':')) {
            [X,Y] = Array.from(rootNode.props.SZ[0].split(':'), (x) => parseInt(x));
        } else {
            X = parseInt(rootNode.props.SZ[0]);
            Y = X;
        }
        for (let i=0; i < Y; i++) {
            EMPTY.push(Array.from(new Array(X + 1).join('.')));
        }
    } else {
        throw new Error('initBoard() requires root node');
    }
    return EMPTY;
}

export {initBoard,clone,getState,initStates}