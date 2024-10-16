//
//
// PPPLLLEEEAAASSSEEE forgive the 
// spagghettishness of this code
// i wanted to try smth and got carried away

import {sgfCoord,numericCoord} from './sgf-utils.js';

let X;
let Y;
let EMPTY;
let STARS;

function getLiberties(state, chain) {
    console.log('in getLiberties()');
    let boardState = matrix(state);
    let liberties = [];
    for (let link of chain) {
        let x = link[0];
        let y = link[1];
        for (let point of adjacentCoords(boardState,link)) {
            if (!arrayHasCoord(liberties,point) && boardState[point[1]][point[0]] === '.') {
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

function adjacentCoords(matrix,coord) {
    let [x,y] = coord;
    let adjacent = [];
    for (let tryIntersection of [[x,y+1],[x,y-1],[x+1,y],[x-1,y]]) {
        let [xx,yy] = tryIntersection;
        console.log('xx,yy',xx,yy)
        if (matrix[yy]!== undefined) {
            console.log('matrix[yy]',matrix[yy]);
            if (matrix[yy][xx] !== undefined) {
                adjacent.push(tryIntersection);
            }
        }
    }
    return adjacent;
}

function adjacentLinks(matrix,coord) {
    let chainColor = getValue(matrix,coord);
    let adjacent = adjacentCoords(matrix,coord);
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
        if (JSON.stringify(link) === JSON.stringify(coord)) {
            return true;
        }
    }
    return false;
}

function getChain(state,coord,chain=[]) {
    console.log('state',state)
    let goban = matrix(state);
    if (!arrayHasCoord(chain,coord)) {
        chain.push(coord);
    }
    for (let link of adjacentLinks(goban,coord)) {
        if (!arrayHasCoord(chain,link)) {
            chain = getChain(state,link,chain);
        }
    }
    return chain;
}

function calculateBoard(state,moves) {
    console.log('in calculateBoard()');
    let newState = matrix(state);
    let friendly = moves[0];
    let enemy = 'BW'.at('BW'.indexOf(friendly)-1);
    let checkFriendlyPoints = moves.slice(1);
    let checkEnemyPoints = [];
    for (let move of moves.slice(1)) {
        let x = move[0];
        let y = move[1];
        newState[y][x] = moves[0];

        for (let point of [[x,y+1],[x,y-1],[x+1,y],[x-1,y]]) {
            if (point[0] > -1 && point[0] < X) {
                if (point[1] > -1 && point[1] < Y) {
                    if (newState[point[1]][point[0]] === friendly) {
                        checkFriendlyPoints.push(point);
                    } else if (newState[point[1]][point[0]] === enemy) {
                        checkEnemyPoints.push(point);
                    }
                }
            }
        }
    }

    let friendlyChains = [];
    let enemyChains = [];
    for (let i = 0; i < checkFriendlyPoints.length; i++) {
        let x = checkFriendlyPoints[i][0];
        let y = checkFriendlyPoints[i][1];
        let accountedFor = false;
        for (let chain of friendlyChains) {
            if (arrayHasCoord(chain,[x,y])) {
                accountedFor = true;
            }
        }
        if (!accountedFor) {
            let chain = getChain(uglify(newState),[x,y]);
            friendlyChains.push(chain);
        }
    }
    for (let i=0; i < checkEnemyPoints.length; i++) {
        let x = checkEnemyPoints[i][0];
        let y = checkEnemyPoints[i][1];
        let accountedFor = false;
        for (let chain of enemyChains) {
            if (chain.includes([x,y])) {
                accountedFor = true;
            }
        }
        if (!accountedFor) {
            let chain = getChain(uglify(newState),[x,y]);
            enemyChains.push(chain);
        }
    }
    let removeChains = [];
    for (let i=0; i < enemyChains.length; i++) {
        let liberties = getLiberties(uglify(newState),enemyChains[i]);
        if (liberties.length < 1) {
            removeChains.push(enemyChains[i]);
        }
    }
    for (let i=0; i < removeChains.length; i++) {
        for (let point of removeChains[i]) {
            let x = point[0];
            let y = point[1];
            newState[y][x] = '.';
        }
    }
    console.log(removeChains);
    removeChains = [];
    for (let i=0; i < friendlyChains.length; i++) {
        let liberties = getLiberties(uglify(newState),friendlyChains[i]);
        if (liberties.length < 1) {
            removeChains.push(friendlyChains[i]);
        }
    }
    for (let i=0; i < removeChains.length; i++) {
        for (let point of removeChains[i]) {
            let x = point[0];
            let y = point[1];
            newState[y][x] = '.';
        }
    }
    console.log(removeChains);
    return uglify(newState);
}

function getState(lastState,props) {
    let newState = matrix(lastState);
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
            newState = matrix(calculateBoard(lastState,moves));
        }
    }
    return uglify(newState);
}

function treeStates(node, lastState) {
    if (node.hasOwnProperty('props')) {
        node.state = getState(lastState,node.props);
    } else {
        node.state = lastState;
    }
    if (node.hasOwnProperty('children')) {
        for (let i=0; i < node.children.length; i++) {
            node.children[i] = treeStates(node.children[i],node.state);
        }
    }
    return node;
}

function uglify(matrix) {
    let ugly = '';
    for (let i = 0; i < matrix.length; i++) {
        ugly += matrix[i].join('')
    }
    return ugly;
}

function prettify(state) {
    let currentState = matrix(state);
    let pretty = '';
    let b = 'X'; //●
    let w = 'O'; //○
    let lastB = '𝚾'
    let lastW = '𝚯'
    // 𝙓X𝙊O𝚾𝚯

    for (let i = 0; i < currentState.length; i++) {
        let emptyFirst = '┠';
        let emptyMid = '─';
        let emptyPoint = '┼'
        let emptyLast = '┨';
        if (i === 0) {
            emptyFirst = '┏';
            emptyMid = '━';
            emptyPoint = '┯';
            emptyLast = '┓';
        } else if (i === currentState.length-1) {
            emptyFirst = '┗';
            emptyMid = '━';
            emptyPoint = '┷';
            emptyLast = '┛';
        }
        if (STARS.includes(i)) {
            for (let j of STARS) {
                if (currentState[i][j] === '.') {
                    currentState[i][j] = '╋'//╋╬
                } 
            }
        }
        if (currentState[i][0] === '.') {
            currentState[i][0] = emptyFirst;
        }
        if (currentState[i][X-1] === '.') {
            currentState[i][X-1] = emptyLast;
        }
        let row = currentState[i]
        .join(emptyMid).replaceAll('.',emptyPoint)
        .replaceAll('B',b).replaceAll('W',w)
        .replaceAll('b',lastB).replaceAll('w',lastW);
        pretty += `${sgfCoord[i]} ${row}\n`;
    }
    let toPlay = '▪▫';
    if (pretty.includes(lastW)) {
        toPlay = '▫▪'
    }
    pretty += toPlay + Array.from(sgfCoord.slice(0,X)).join(' ');
    return pretty;
}

function matrix(board) {
    let goban = [];
    for (let y = 0; y < (board.length/X); y++) {
        let row = [];
        for (let x = 0; x < X; x++) {
            row.push(board[(y*X)+x])
        }
        goban.push(row);
    }
    return goban;
}

function initBoard(rootNode) {
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
        EMPTY = new Array((X*Y) + 1).join('.');
    } else {
        throw new Error('initBoard() requires root node');
    }
    if (X === 19 && Y === 19) {
        STARS = [3,9,15];
    } else {
        STARS = [];
    }
}

export {initBoard,matrix,prettify,getState,uglify,treeStates,EMPTY}