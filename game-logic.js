//
//
// PPPLLLEEEAAASSSEEE forgive the 
// spagghettishness of this code
// i wanted to try smth and got carried away

import {sgfCoord,numericCoord} from './sgf-utils.js';

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

function getValue(matrix,coord) {
    return matrix[coord[1]][coord[0]];
}

function setValue(matrix,coord,value) {
    matrix[coord[1]][coord[0]] = value;
    return matrix;
}

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

function coordInChains(chains,coord) {
    for (let chain of chains) {
        if (arrayHasCoord(chain,coord)) {
            return true;
        }
    }
    return false;
}

function setNew(state,move) {
    let lower = getValue(state,move).toLowerCase();
    state = setValue(state,move,lower);
    return state;
}

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

function getState(lastState,props) {
    let newState = clone(lastState);
    for (let key of Object.keys(props)) {
        if (['AB','AE','AW'].includes(key)) {
            let point = key[1];
            if (point === 'E') {
                point = '.';
            }
            for (let i=0; i<props[key].length; i++) {
                let newCoord = numericCoord(props[key][i]);
                newState[newCoord[1]][newCoord[0]] = point;
            }
        } else if (['B','W'].includes(key) && props[key][0].length>0) {
            let moves = [key];
            for (let move of props[key]) {
                moves.push(numericCoord(move));
            }
            newState = calculateBoard(lastState,moves);
        }
    }
    return newState;
}

function initStates(lastState, gameTree) {
    gameTree.state = getState(lastState,gameTree.props);
    if (gameTree.hasOwnProperty('children')) {
        for (let child of gameTree.children) {
            child = initStates(gameTree.state,child);
        }
    }
    return gameTree;
}

function prettify(goban) {
    let state = clone(goban,true);
    let Y = state.length;
    let X = state[0].length;
    let stars = [];
    if (Y === 19 && X === 19) {
        stars = [3,9,15];
    } 
    let pretty = '//' + Array.from(sgfCoord.slice(0,X)).join(' ') + '\\\\\n';
    let b = 'X'; //●
    let w = 'O'; //○
    let lastB = 'X̂'
    let lastW = 'ʘ'

    for (let y = 0; y < state.length; y++) {
        let emptyFirst = '┠';
        let emptyMid = '─';
        let emptyPoint = '┼'
        let emptyLast = '┨';
        if (y === 0) {
            emptyFirst = '┏';
            emptyMid = '━';
            emptyPoint = '┯';
            emptyLast = '┓';
        } else if (y === state.length-1) {
            emptyFirst = '┗';
            emptyMid = '━';
            emptyPoint = '┷';
            emptyLast = '┛';
        }
        if (stars.includes(y)) {
            for (let j of stars) {
                if (state[y][j] === '.') {
                    state[y][j] = '╋'//╋╬
                } 
            }
        }
        if (state[y][0] === '.') {
            state[y][0] = emptyFirst;
        }
        if (state[y][X-1] === '.') {
            state[y][X-1] = emptyLast;
        }
        let row = state[y]
        .join(emptyMid).replaceAll('.',emptyPoint)
        .replaceAll('B',b).replaceAll('W',w)
        .replaceAll('b',lastB).replaceAll('w',lastW);
        pretty += `${sgfCoord[y]} ${row} ${sgfCoord[y]}\n`;
    }
    let toPlay = '▪▫';
    if (pretty.includes(lastW)) {
        toPlay = '▫▪'
    }
    pretty += toPlay + Array.from(sgfCoord.slice(0,X)).join(' ') + '//';
    return pretty;
}

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

function initBoard(rootNode) {
    let EMPTY = [];
    let X,Y;
    if (rootNode.id === 0) {
        if (!rootNode.hasOwnProperty('props')) {
            rootNode.props.SZ = ['19'];
        } else if (!rootNode.props.hasOwnProperty('SZ')) {
            rootNode.props.SZ = ['19'];
        }
        if (rootNode.props.SZ.includes(':')) {
            [X,Y] = Array.from(
                rootNode.props.SZ[0].split(':'),
                (x) => parseInt(x)
            );
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

export {initBoard,clone,prettify,getState,initStates}