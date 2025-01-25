/**
 * SGF parsing module
 * @module parse-sgf
 */

import { parseProperty } from './parse-properties.js';

/**
 * @private
 * @param {string} sgf SGF string to parse
 * @returns {{
 * type: ('terminal'|'propVal'|'propId');
 * value: string;
 * }[]} array of token objects
 */
const tokenize = (sgf, callback) => {
    let tokens = [];

    let inBrackets = false;
    let escaped = false;
    let value = '';

    const pushToken = (type) => {
        tokens.push({ type, value });
        value = '';
        if (type === 'propVal') inBrackets = false;
    }

    const handlePropVal = (char) => {
        if (escaped) {
            escaped = false;
            if (char === ':') value += '<ESCAPEDCOLON>';
            else if (char !== '\n') value += char;
        } else if (char === '\\') escaped = true;
        else if (char === ']') pushToken('propVal');
        else value += char;
    }

    for (let i = 0; i < sgf.length; i++) {
        if (inBrackets) handlePropVal(sgf[i]);
        else if (sgf[i] === '[') {
            if (value) pushToken('propId');
            inBrackets = true;
        } else if (/[A-Z]/.test(sgf[i])) value += sgf[i];
        else if (value) throw new Error('expecting propVal after propId');
        else if ('();'.includes(sgf[i])) tokens.push({ type: 'terminal', value: sgf[i] });
    }

    if (inBrackets) throw new Error("missing ']'");

    if (typeof callback === 'function') callback(tokens);
    else return tokens;
}

/**
 * @private
 * @param {Array} tokens Tokenized SGF
 * @returns {{
 * type: (
 * '('|')'|';');
 * id?: number;
 * value?: string;
 * props?: {};
 * }[]} Condensed token array
 */
const parseTokens = (tokens, callback) => {
    let nodes = [];
    let node = null;
    let propId = '';
    let id = 0;

    const handleTerminal = (char) => {
        if ('()'.includes(char)) node &&= null;
        else node = { id: id++ };
        nodes.push( node || char );
    }

    const handlePropId = (id) => {
        propId = id;
        if (node.props?.[propId]) throw new Error('duplicate property');
        if (!node.props) node.props = {};
        node.props[propId] = [];
    }

    const handlePropVal = (propVal) => {
        if (parseProperty[propId]) {
            node.props[propId].push(parseProperty[propId](propVal));
        } else {
            console.log('private property');
            node.props[propId].push(propVal);
        }
    }

    for (let i=0; i < tokens.length; i++) {

        const tok = tokens[i];

        if (tok.type === 'terminal') handleTerminal(tok.value);
        else if (!node) throw new Error(`cannot assign ${tok} to node ${node}`);
        else if (tok.type === 'propId') handlePropId(tok.value);
        else if (tok.type === 'propVal') handlePropVal(tok.value);
    }

    if (typeof callback === 'function') callback(nodes);
    else return nodes;
}

const buildGameObject = (tokens) => {
    let position = 0;
    let depth = 0;
    
    const makeTree = (parent = null, moveNumber = 0) => {
        const tok = tokens[position++];

        if (tok === ')') {
            depth--;
            return null;
        } else if (tok === '(') {
            const surface = depth++;
            const branches = [];
            while (position < tokens.length) {
                const branch = makeTree(parent,moveNumber);
                if (branch) branches.push(...branch);
                if (depth < surface) break;
            }
            return branches;
        }
        const node = { ...tok, moveNumber, parent };
        node.children = makeTree(node, moveNumber+1) || [];
        return [node];
    }

    return makeTree();
}



export { tokenize, parseTokens, buildGameObject };