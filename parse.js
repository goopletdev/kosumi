/**
 * @private
 * @param {string} sgf SGF string to search through
 * @param {number} position Position in string to begin search
 * @returns {number} Position of next valid ']' after given position
 */
function matchingSqBracket(sgf, position=1) {
    let escaped = false;
    for (let i=position; i < sgf.length; i++) {
        if (escaped) {
            escaped = false;
        } else if (sgf[i] === '\\') {
            escaped = true;
        } else if (sgf[i] === ']') {
            return i;
        }
    }
    return -1;
}

/**
 * @private
 * @param {string} sgf SGF string to parse
 * @returns {{
 * tokenType: (
 * 'openGameTree'|'closeGameTree'|'newNode'|'propValue'|'propIdent');
 * value?: string;
 * depth?: number;
 * }[]} array of token objects
 */
function tokenize(sgf) {
    let tokens = [];
    let j = -1;
    for (let i = 0; i < sgf.length; i++) {
        let token;
        let char = sgf[i];
        if (j > i) {
            continue;
        } else if (char === '(') {
            token = {
                tokenType: 'openGameTree',
            }
        } else if (char === ')') {
            token = {
                tokenType: 'closeGameTree',
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
 * @private
 * @param {Array} tokens Array of tokens to search
 * @returns {number} Position of token that isn't part of last node
 */
function endNode(tokens) {
    let unallowedTypes = ['openGameTree','closeGameTree','newNode']
    for (let i = 0; i < tokens.length; i++) {
        if (unallowedTypes.includes(tokens[i].tokenType)) {
            return i;
        }
    }
    return -1;
}

/**
 * @private
 * @param {Array} propToks Array of property tokens of one node
 * @returns {{}} Object containing a node's properties
 */
function handleProps(propToks) {
    let properties = {}
    let keyValPairs = [];
    for (let prop of propToks) {
        if (prop.tokenType === 'propIdent') {
            keyValPairs.push([prop.value]);
        } else {
            keyValPairs[keyValPairs.length-1].push(prop.value);
        }
    }
    for (let pair of keyValPairs) {
        let values = pair.slice(1);
        if (values.length === 1) {
            values = values[0];
        }
        properties[pair[0]] = values;
    }
    return properties;
}

/**
 * @private
 * @param {Array} tokens Tokenized SGF
 * @returns {Array} Condensed token list
 */
function ensquishenTokens(tokens) {
    let squishedTokens = [];
    for (let i=0; i<tokens.length;i++) {
        if (i > 500) break;
        let token = tokens[i]
        switch (token.tokenType) {

            case 'openGameTree':
                squishedTokens.push(token);
                break;

            case 'closeGameTree':
                squishedTokens.push(token);
                break;

            case 'newNode':
                let j = endNode(tokens.slice(i+1)) + i + 1;
                let props = tokens.slice(i, j);
                token.props = handleProps(props.slice(1));
                squishedTokens.push(token);
                break;
        }
    }
    return squishedTokens;
}

/**
 * @private
 * @param {Array} toks Slice of tokens after openGameTree 
 * @returns {number} Position of matching closeGameTree token
 */
function getTreeEnd(toks) {
    let j = -1;
    for (let i = 0; i < toks.length; i++) {
        let token = toks[i];
        if (token.tokenType === 'openGameTree') {
            j++;
        } else if (token.tokenType === 'closeGameTree' && j < 0) {
            return i;
        } else if (token.tokenType === 'closeGameTree') {
            j--;
        }
    }
    return -1;
}

/**
 * @private
 * @param {Array} tokens Tokens incl. open/closeGameTree, newNode
 * @returns {{}} Node tree of all moves and variations
 */
function makeTree(tokens) {
    switch (tokens[0].tokenType) {
        case 'openGameTree':
            let trees = [];
            while (tokens.length) {
                let treeEnd = getTreeEnd(tokens.slice(1)) + 1;
                let subTree = tokens.slice(1,treeEnd);
                let subNode = makeTree(subTree);
                trees.push(subNode);
                tokens = tokens.slice(treeEnd+1);
            }
            return trees;

        case 'newNode':
            let node= {}
            if (tokens[0].hasOwnProperty('props')) {
                node.props = tokens[0].props;
            }
            if (tokens.length > 1) {
                let childs = makeTree(tokens.slice(1));
                if (Array.isArray(childs)) {
                    node.children = childs;
                } else {
                    node.children = [childs];
                }
            } else {
                delete node.children;
            }
            return node;
    }
    return -1;
}

/**
 * test function
 */
function testFunctionII() {
    let sgfInput = document.querySelector('textarea').value;
    let outputDiv = document.getElementById('output');
    let tokens = tokenize(sgfInput);
    let squishedTokens = ensquishenTokens(tokens);
    let tree = makeTree(squishedTokens);
    let printTree = JSON.stringify(tree,null,1);
    console.log(printTree);
    for (object of tree) {
        console.log(object);
        let pTree = JSON.stringify(object,null,1);
        console.log(pTree);
        outputDiv.innerText = outputDiv.innerText + pTree;
    }
}