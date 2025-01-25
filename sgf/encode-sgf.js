import { sgfPropOrder } from "./sgfProperties.js";
import { encodeProperty } from './property-encode.js';
const propOrder = sgfPropOrder.flat();
const blackInfo = ['PB','BR','BT'];
const whiteInfo = ['PW','WR','WT'];
const timeInfo = ['TM','OT'];

// TO DO:
// style the whitespace of the root node?
// arrange keys of each node in order

/**
 * Encodes a game object as an SGF string
 * @param {object} node Root node of game tree
 * @returns {string} SGF string
 */
const stringify = (node) => {
    let sgf = ';';

    const handleProps = (props) => {
        Object.keys(props).forEach(id => sgf += `${id}[${
            encodeProperty?.[id](props[id]) || props[id].join('][')
        }]`);
    }

    const handleChilds = (node) => {
        sgf += node.children.map(child => stringify(child)).join(')\n(');
        sgf = node.children.length > 1 ? `(${sgf})` : sgf;
    }

    if (node.props) handleProps(node.props);
    if (node.children) handleChilds(node);
    
    return node.parent ? sgf : `(${sgf})`;
}

export {
    stringify,
}