async function MakeSGF(node, headerBreaks=false, nodeBreaks=false) {
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
        if (nodeBreaks) {
            newline = '\n'
        }
        for (let i = 0; i < node.children.length; i++) {

            sgf = sgf + newline + await MakeSGF(
                node.children[i], headerBreaks, nodeBreaks
            );
        }
    }
    if (!node.hasOwnProperty('parent')) {
        sgf = `(${sgf})`;
    }
    return sgf;
}

async function makeCollection(nodes) {
    let collection = [];
    for (i = 0; i < nodes.length; i++) {
        collection.push(await MakeSGF(nodes[i]));
    }
    return collection.join('\n');
}

export {makeCollection, MakeSGF as default};