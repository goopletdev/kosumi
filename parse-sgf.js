/**
 * @private
 * @param {string} sgf SGF string to search through
 * @returns {number} Position of next valid ']'
 */
function matchingSqBracket(sgf) {
    let escaped = false;
    for (let i=0; i < sgf.length; i++) {
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
 * '('|')'|';'|'propValue'|'propIdent');
 * value?: string;
 * depth?: number;
 * }[]} array of token objects
 */
function tokenize(sgf) {
    let tokens = [];
    let j = -1;
    for (let i = 0; i < sgf.length; i++) {
        let token = {};
        let char = sgf[i];
        if (j > i) {
            continue;
        } else if ('();'.includes(char)) {
            token.tokenType = char;
        } else if (char === '[') {
            j = matchingSqBracket(sgf.slice(i)) + i;
            token.tokenType = 'propValue';
            token.value = sgf.slice(i + 1, j)
            j++;
        } else if (/[A-Z]/.test(sgf[i])) {
            j = sgf.indexOf('[',i);
            token.tokenType = 'propIdent';
            token.value = sgf.slice(i,j);
        } else {
            console.log(`'${sgf[i]}' not valid SGF char`);
            continue;
        }
        tokens.push(token);
    }
    return tokens;
}

/**
 * @private
 * @param {Array} tokens Array of tokens to search
 * @returns {number} Position of next post-node token
 */
function endNode(tokens) {
    for (let i = 1; i < tokens.length; i++) {
        if ('();'.includes(tokens[i].tokenType)) {
            return i;
        }
    }
    return -1;
}

/**
 * @private
 * @param {Array} propTokens Array of a node's prop tokens
 * @returns {{}} Object containing a node's properties
 */
function handleProps(propTokens) {
    let properties = {}
    let entries = [];
    for (let prop of propTokens) {
        if (prop.tokenType === 'propIdent') {
            entries.push([prop.value]);
        } else {
            entries[entries.length-1].push(prop.value);
        }
    }
    for (let pair of entries) {
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
        let token = tokens[i]
        switch (token.tokenType) {

            case '(':
                squishedTokens.push(token);
                break;

            case ')':
                squishedTokens.push(token);
                break;

            case ';':
                let j = endNode(tokens.slice(i)) + i;
                let props = tokens.slice(i, j);
                token.props = handleProps(props.slice(1));
                squishedTokens.push(token);
                break;
        }
        console.log(token);
    }
    return squishedTokens;
}

/**
 * @private
 * @param {Array} toks Slice of toks starting w/ '('
 * @returns {number} Position of matching ')' token
 */
function getTreeEnd(toks) {
    let j = -1;
    for (let i = 1; i < toks.length; i++) {
        let token = toks[i];
        if (token.tokenType === '(') {
            j++;
        } else if (token.tokenType === ')' && j < 0) {
            return i;
        } else if (token.tokenType === ')') {
            j--;
        }
    }
    return -1;
}

/**
 * @private
 * @param {Array} tokens Tokens incl. '(', ')', ';'
 * @returns {{}} Node tree of all moves and variations
 */
function makeTree(tokens) {
    switch (tokens[0].tokenType) {
        case '(':
            let trees = [];
            while (tokens.length) {
                let treeEnd = getTreeEnd(tokens);
                let subTree = tokens.slice(1,treeEnd);
                let subNode = makeTree(subTree);
                trees.push(subNode);
                tokens = tokens.slice(treeEnd+1);
            }
            return trees;

        case ';':
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
            }
            return node;
    }
    return -1;
}

/**
 * @param {string} sgf SGF string
 * @returns {} Game node tree
 */
function ParseSGF(sgf) {
    return makeTree(ensquishenTokens(tokenize(sgf)));
}

export default ParseSGF;