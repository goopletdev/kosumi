/**
 * SGF parsing module
 * @module parse-sgf
 */

import SGF from "./sgf.js";
import { propertyDefinitions } from "./sgfProperties.js";

/**
 * @private
 * @param {string} sgf SGF string to parse
 * @returns {{
 * type: (
 * '('|')'|';'|'propVal'|'propId');
 * value?: string;
 * depth?: number;
 * }[]} array of token objects
 */
function tokenize(sgf,callback) {
    let tokens = [];

    let inpropId = false;
    let propIdContent = '';

    let bracketPos;
    let inBrackets = false;
    let escaped = false;
    let bracketContents = '';

    for (let i = 0; i < sgf.length; i++) {

        // handle square bracket contents (property value)
        if (inBrackets && escaped) {
            escaped = false;
            bracketContents += sgf[i];
        } else if (inBrackets && sgf[i] === '\\') {
            escaped = true;
        } else if (inBrackets && sgf[i] === ']') {
            inBrackets = false;
            tokens.push({
                type: 'propVal',
                value: bracketContents.slice(0)
            })
            bracketContents = '';
        } else if (inBrackets && i < sgf.length - 1) {
            bracketContents += sgf[i];
        } else if (inBrackets) {
            throw new Error(
                `missing ']' after [ at ${bracketPos}`
            )
        } else if (sgf[i] === '[') {
            bracketPos = i;
            inBrackets = true;

        // handle property identifier
        } else if (/[A-Z]/.test(sgf[i])) {
            propIdContent += sgf[i];
            inpropId = true;
            if (!/[A-Z]/.test(sgf[i+1])) {
                if (sgf[i+1] === '[') {
                    inpropId = false;
                }
                tokens.push({
                    type: 'propId',
                    value: propIdContent.slice(0)
                })
                propIdContent = '';
            }
        } else if (inpropId) {
            throw new Error(
                `expecting propVal after propId '${
                    tokens[tokens.length-1].value
                }'`
            )

        // non-bracket terminal symbols
        } else if ('();'.includes(sgf[i])) {
            tokens.push({
                type: sgf[i]
            })
        } else {
            // console.log(`'${sgf[i]}' not valid SGF char`);
        }
    }
    callback(tokens);
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
 * }[]} Condensed token list
 */
function parseTokens(tokens,callback) {

    let parsedToks = [];
    let inNode = false;
    let propertyId = '';
    let id = 0;

    for (let i=0; i<tokens.length;i++) {

        let tok = tokens[i]

        // open/close game tree tokens
        if ('()'.includes(tok.type)) {
            parsedToks.push(tok);

        // new node token
        } else if (tok.type === ';') {
            if (tokens[i+1].type === 'propId') {
                inNode = true;
            } else {
                console.log('empty node');
            }
            tok.id = id;
            id ++;
            parsedToks.push(tok);

        // handle node properties
        } else if (inNode) {
            let node = parsedToks[parsedToks.length-1];
            if (!node.hasOwnProperty('props')){
                node.props = {};
            }
            if (tok.type === 'propId') {
                propertyId = tok.value;
                node.props[propertyId] = [];
                if (tokens[i+1].type !== 'propVal') {
                    throw new Error(
                        `expected propVal after ${
                            propertyId
                        }`
                    )
                }
            } else { // token.type is propVal
                // unzip coordinates, convert alpha to numeric coords
                if (SGF.zippableProperties.includes(propertyId)
                    && tok.value.includes(':')) {
                        for (let value of SGF.unzipCoords(tok.value)) {
                            node.props[propertyId].push(SGF.numericCoord(value));
                        }
                } else if (propertyDefinitions[propertyId].value.includes('stone')
                    || propertyDefinitions[propertyId].value.includes('point')
                    || ['B','W'].includes(propertyId)) {
                        node.props[propertyId].push(SGF.numericCoord(tok.value));
                } else {
                    node.props[propertyId].push(tok.value);
                }
                if ('();'.includes(tokens[i+1].type)) {
                    inNode = false;
                }
            }

        }
    }
    callback(parsedToks);
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
        if (token.type === '(') {
            j++;
        } else if (token.type === ')' && j < 0) {
            return i;
        } else if (token.type === ')') {
            j--;
        }
    }
    return -1;
}

/**
 * @private
 * @param {Array} tokens Tokens of type '(', ')', ';'
 * @returns {{}} Node tree of all moves and variations
 */
function makeTree(tokens, parent, move = 0) {
    if (tokens) {
        if (tokens[0].type === '(') {
            let trees = [];
            while (tokens.length) {
                let treeEnd = getTreeEnd(tokens);
                let subTree = tokens.slice(1,treeEnd);
                let subNode = makeTree(
                    subTree, parent, move
                );
                trees.push(subNode);
                tokens = tokens.slice(treeEnd+1);
            }
            return trees;
        } else if (tokens[0].type === ';') {
            let node = {
                id: tokens[0].id,
                moveNumber: move
            }
            if (parent) {
                node.parent = parent;
            }
            if (tokens[0].hasOwnProperty('props')) {
                node.props = tokens[0].props;
                // check whether erroneous root props at non-root node
                if (node.hasOwnProperty('parent')) {
                    for (let key of Object.keys(node.props)) {
                        if (SGF.rootProperties.includes(key)) {
                            console.log(`Error: root ${key} at node ${node.id}`);
                        }
                    }
                }
            }
            if (tokens.length > 1) {
                let childs = makeTree(
                    tokens.slice(1),node,move+1
                );
                if (Array.isArray(childs)) {
                    node.children = childs;
                } else {
                    node.children = [childs];
                }
            }
            return node;
        }
    } else {
        throw new Error(
            `'tokens' in makeTree is ${tokens}`
        )
    }
}

export {tokenize, parseTokens, makeTree};