/**
 * Returns position of next valid ']' after a given position.
 * @param {string} sgf 
 * @param {number} position 
 * @returns {number}
 */
function matchingSqBracket(sgf, position=1) {
    let escaped = false;
    for (let i=position; i < sgf.length; i++) {
        if (escaped) {
            escaped = false;
            continue;
        } else if (sgf[i] === '\\') {
            escaped = true;
            continue;
        } else if (sgf[i] === ']') {
            return i;
        }
    }
    return -1;
}

/**
 * Returns an array of token objects.
 * @param {string} sgf 
 * @returns {{
 * tokenType: (
 * 'openGameTree'|'closeGameTree'|'newNode'|'propValue'|'propIdent');
 * value?: string;
 * depth?: number;
 * }[]}
 */
function tokenize(sgf) {
    let tokens = [];
    //let depth = 0;
    let j = -1;
    for (let i = 0; i < sgf.length; i++) {
        let token;
        let char = sgf[i];
        if (j > i) {
            continue;
        } else if (char === '(') {
            //depth++;
            token = {
                tokenType: 'openGameTree',
                //depth: depth
            }
        } else if (char === ')') {
            //depth--;
            token = {
                tokenType: 'closeGameTree',
                //depth: depth
            }
        } else if (char === ';') {
            token = {
                tokenType: 'newNode',
            }
        } else if (char === '[') {
            j = matchingSqBracket(sgf,i);
            token = {
                tokenType: 'propValue',
                value: sgf.slice(i+1,j)
            }
            j++;
        } else if (/[A-Z]/.test(sgf[i])) {
            j = sgf.indexOf('[',i);
            token = {
                tokenType: 'propIdent',
                value: sgf.slice(i,j)
            }
        } else {
            console.log(`'${sgf[i]}' not a valid SGF character`);
            continue;
        }
        tokens.push(token);
    }
    return tokens;
}

/**
 * Returns position of next token that is not of tokenType 'propValue'
 * @param {Array} tokens 
 * @param {number} position 
 * @returns {number}
 */
function nextNonPropValToken(tokens, position) {
    for (let i=position; i < tokens.length; i++) {
        if (tokens[i].tokenType !== 'propValue') {
            return i;
        }
    }
    return -1;
}

/**
 * Returns a property object; segment of a node
 * This function in particular is bothering me.
 * Find way to simplify it? 
 * @param {string} propIdent 
 * @param {string} propValues 
 * @returns {{
 * identifier: string;
 * value: string;
 * type: string;
 * description?: string;
 * valType?: string;
 * }}
 */
function handleProperty(propIdent, propValues) {
    //laundry!!!!! first thing!!
    if (propValues.length === 1) {
        propValues = propValues[0]
    }
    let property = {
        identifier: propIdent,
        value: propValues
    }
    if (gameProps.hasOwnProperty(propIdent)) {
        let [propDesc, propType, propValType] = gameProps[propIdent];
        property.description = propDesc;
        property.type = propType;
        property.valType = propValType;
    } else {
        property.type = 'UNKNOWN';
        return property;
    }
    if (property.propIdent === 'GM' && property.value !== 1) {
        console.log('') // learn about error handling; this is not a valid
        //GO sgf
    }

    return property;
}

/**
 * Returns array of Game objects 
 * @param {Array} tokens 
 * @returns {{
 * root: {Array};
 * info: {Array};
 * moves: {Array}; 
 * children: {Array};
 * errors: {Array}
 * }[]}
 */
function parseTokens(tokens) {
    let collection = [];
    let gameTrees = [];
    let j = -1;
    let gameTreeDepth = -1;
    let nodeDepth = -1;
    for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].tokenType) {

            case 'openGameTree':
                gameTreeDepth++;
                nodeDepth = -1;
                gameTrees.push({
                    moves: [],
                    children: [],
                    info: [],
                    root: [],
                    errors: []
                });
                break;

            case 'closeGameTree':
                let gameTree = gameTrees.pop();
                gameTreeDepth--;
                if (gameTrees.length) {
                    gameTrees[gameTreeDepth].children.push(gameTree);
                } else {
                    collection.push(gameTree);
                }
                break;

            case 'newNode':
                nodeDepth++;
                gameTrees[gameTreeDepth].moves.push([]);
                break;

            case 'propIdent':
                j = nextNonPropValToken(tokens,i+1);
                let vals = Array.from(tokens.slice(i+1,j), (x) => x.value);
                let property = handleProperty(tokens[i].value, vals);

                if (property.type === 'root' && gameTreeDepth === 0) {
                    gameTrees[gameTreeDepth].root.push(property);

                } else if (property.type === 'root') {
                    property.position = [gameTreeDepth,nodeDepth];
                    gameTrees[gameTreeDepth].errors.push(property); 

                } else if (property.type === 'game-info' && nodeDepth === 0) {
                    gameTrees[gameTreeDepth].info.push(property);

                } else if (property.type === 'game-info') {
                    property.position = [gameTreeDepth,nodeDepth];
                    gameTrees[gameTreeDepth].errors.push(property);

                } else {
                    gameTrees[gameTreeDepth].moves[nodeDepth].push(property);
                }
                break;
        }
    }
    return collection;
}

/**
 * Parses an SGF string to the fullest extent that the existing functions can.
 * @param {string} sgf 
 * @returns {{}[]}
 */
function parseSGF(sgf) {
    let tokens = tokenize(sgf);
    let collection = parseTokens(tokens);
    return collection;
}

/**
 * Test function
 */
function tokenTest() {
    let sgfInput = document.querySelector('textarea').value;
    let goGameObjects = parseSGF(sgfInput);
    for (object of goGameObjects) {
        console.log(object);
    };
}