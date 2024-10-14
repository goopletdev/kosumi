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
async function MakeSGF(node, headerBreaks=true, nodeBreaks=true) {
    let sgf = ';';
    if (node.hasOwnProperty('props')) {
        for (let key of Object.keys(node.props)) {
            let sufx = '';
            if (node.id === 0 && headerBreaks) {
                sufx = '\n';
            }
            let values = [];
            for (let val of node.props[key]) {
                values.push(
                    val.replaceAll('\\','\\\\')
                    .replaceAll(']','\\]')
                );
            }
            sgf += `${key}[${
                values.join('][')
            }]${sufx}`;
        }
    }
    if (node.hasOwnProperty('children')) {
        let newline = '';
        if (nodeBreaks && node.id > 0) {
            newline = '\n'
        }
        for (let i = 0; i < node.children.length; i++) {

            sgf += newline + await MakeSGF(
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
async function makeCollection(nodes) {
    let collection = [];
    for (i = 0; i < nodes.length; i++) {
        collection.push(await MakeSGF(nodes[i]));
    }
    return collection.join('\n');
}

export {makeCollection, MakeSGF as default};