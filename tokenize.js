/**
 * Returns position of next valid ']' after a given position.
 * @param {string} sgf 
 * @param {number} position 
 * @returns {number}
 */
function matchingSqBracket(sgf, position=1) {
    for (let i=position; i < sgf.length; i++) {
        if (sgf[i-1] === '\\') {
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
    let depth = 0;
    let j = -1;
    for (let i = 0; i < sgf.length; i++) {
        let token;
        let char = sgf[i];
        if (j > i) {
            continue;
        } else if (char === '(') {
            depth++;
            token = {
                tokenType: 'openGameTree',
                depth: depth
            }
        } else if (char === ')') {
            depth--;
            token = {
                tokenType: 'closeGameTree',
                depth: depth
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


function parseProperty(propIdent, propValues) {
    if (propValues.length === 1) {
        propValues = propValues[0]
    }
    let property = {
        tokenType: 'property',
        identifier: propIdent,
        value: propValues
    }
    return property;
}

/**
 * Returns array of tokens, with tokenType 'propIdent' 
 * and 'propValue' tokens grouped into 'property' tokens.
 * @param {Array} tokens 
 * @returns {{
 * tokenType: ('openGameTree'|'closeGameTree'|'newNode'|'property');
 * value?: string;
 * depth?: number; 
 * identifier?: string
 * values?: string[]
 * }[]}
 */
function parseTokens(tokens) {
    let gameTrees = [];
    let parsedTokens = [];
    let j = -1;
    let gameTreeDepth = -1;
    let nodeDepth = -1;
    for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].tokenType) {
            case 'openGameTree':
                gameTreeDepth++;
                nodeDepth = -1;
                gameTrees.push([]);
                break;
            case 'closeGameTree':
                let gameTree = gameTrees.pop();
                gameTreeDepth--;
                if (gameTrees.length) {
                    gameTrees[gameTreeDepth].push(gameTree);
                } else {
                    parsedTokens.push(gameTree);
                }
                break;
            case 'newNode':
                nodeDepth++;
                gameTrees[gameTreeDepth].push([]);
                break;
            case 'propIdent':
                j = nextNonPropValToken(tokens,i+1);
                let vals = Array.from(tokens.slice(i+1,j), (x) => x.value);
                let property = parseProperty(tokens[i].value, vals);
                gameTrees[gameTreeDepth][nodeDepth].push(property);
                break;
        }
    }
    return parsedTokens;
}

/**
 * Parses an SGF string to the fullest extent that the existing functions can.
 * @param {string} sgf 
 * @returns 
 */
function parseSGF(sgf) {
    let tokens = tokenize(sgf);
    let gameObject = (parseTokens(tokens));
    return gameObject;
}

/**
 * Test function
 */
function tokenTest() {
    let sgfInput = document.querySelector('textarea').value;
    let goGameObject = parseSGF(sgfInput);
    for (object of goGameObject[0]) {
        console.log(object);
    }
}