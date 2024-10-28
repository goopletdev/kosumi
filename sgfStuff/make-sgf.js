import { sgfPropOrder, rootProperties } from "../sgfStuff/sgfProperties.js";
const propOrder = sgfPropOrder.flat();
/**
 * 
 * @param {{
 * id: number;
 * moveNumber: number;
 * parent?: number;
 * props?: {};
 * children?: {}[]
 * }} node Root node from game tree
 * @param {boolean} headerBreaks Whitespace in first node
 * @param {boolean} nodeBreaks Whitespace after nodes
 * @returns {string} SGF string
 */
function MakeSGF(node, headerBreaks=true, nodeBreaks=true) {
    let sgf = ';';
    if (node.hasOwnProperty('props')) {
        let orderedKeys = [];
        for (let propIdent of propOrder) {
            if (Object.keys(node.props).includes(propIdent)) {
                orderedKeys.push(propIdent);
            }
        }
        orderedKeys.forEach((key, i) => {
            let suffix = '';
            if (node.id === 0 && headerBreaks && !rootProperties.includes(orderedKeys[i+1])) {
                suffix = '\n';
            }
            let values = [];
            for (let val of node.props[key]) {
                values.push(
                    val.replaceAll('\\','\\\\')
                    .replaceAll(']','\\]')
                );
            }
            sgf += `${key}[${values.join('][')}]${suffix}`;
        })
    }
    if (node.hasOwnProperty('children')) {
        let newline = '';
        if (nodeBreaks && node.id > 0) {
            newline = '\n'
        }
        for (let i = 0; i < node.children.length; i++) {
            sgf += newline + MakeSGF(
                node.children[i], headerBreaks, nodeBreaks
            );
        }
    }
    if (!node.hasOwnProperty('parent')) {
        sgf = `(${sgf})`;
    }
    return sgf;
}

/**
 * 
 * @param {{
 * id: number;
 * moveNumber: number;
 * parent?: number;
 * props?: {};
 * children?: {}[]
 * }[]} node Collection of game tree root nodes
 * @param {boolean} headerBreaks Whitespace in first node
 * @param {boolean} nodeBreaks Whitespace after nodes
 * @returns {string} SGF string
 */
function makeCollection(nodes) {
    let collection = [];
    for (i = 0; i < nodes.length; i++) {
        collection.push(MakeSGF(nodes[i]));
    }
    return collection.join('\n');
}

export {makeCollection, MakeSGF as default};