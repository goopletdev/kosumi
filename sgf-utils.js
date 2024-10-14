const sgfCoord = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const zipable = [
    'AB',
    'AE',
    'AW',
    'CR',
    'DD',
    'MA',
    'SL',
    'SQ',
    'TR',
    'VW'
]

function numericCoord(coord) {
    let numCoord = [];
    for (let i = 0; i < coord.length; i++) {
        numCoord.push(sgfCoord.indexOf(coord[i]));
    }
    return numCoord;
}

function unzipCoords(zipped) {
    let coords = [];
    let unzipped = [];
    for (let coord of zipped.split(':')) {
        coords.push(numericCoord(coord));
    }
    let rangeX = '';
    for (let x = coords[0][0]; x <= coords[1][0]; x++) {
        rangeX += sgfCoord[x];
    }
    let rangeY = '';
    for (let y = coords[0][1]; y <= coords[1][1]; y++) {
        rangeY += sgfCoord[y];
    }

    for (let i = 0; i < rangeX.length; i++) {
        for (let j = 0; j < rangeY.length; j++) {
            unzipped.push(rangeX[i] + rangeY[j]);
        }
    }
    return unzipped;
}

async function unzipProps(props) {
    for (let key of Object.keys(props)) {
        let newValue = [];
        if (zipable.includes(key)) {
            for (let i=0; i < props[key].length; i++) {
                if (props[key][i].includes(':')) {
                    let unz = unzipCoords(props[key][i]);
                    for (let c of unz) {
                        newValue.push(c);
                    }
                } else {
                    newValue.push(props[key][i]);
                }
            }
            props[key] = newValue;
        } 
    }
    return props;
}

async function formatProps(node) {
    if (node.hasOwnProperty('props')) {
        node.props = await unzipProps(node.props);
    }
    if (node.hasOwnProperty('children')) {
        for (i=0; i < node.children.length; i++) {
            await formatProps(node.children[i]);
        }
    }
    return node;
}


export {numericCoord,unzipCoords,formatProps}