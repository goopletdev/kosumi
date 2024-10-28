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
    'VW',
]
const root = [
    'FF',
    'GM',
    'AP',
    'CA',
    'ST',
    'SZ',
]

const gameInfoProps = [
    'AN', //  name of annotator
    'BR', // Black rank
    'BT', // Black team name (team matches)
    'CP', // copyright info
    'DT', // date when game was played
    'EV', 
    'GN',
    'GC',
    'ON',
    'OT',
    'PB',
    'PC',
    'PW',
    'RE',
    'RO',
    'RU',
    'SO',
    'TM',
    'US', //name of user who entered game
    'WR', // white player rank
    'WT', // white team name
]

const moveProps = [
    'MN',
    'B',
    'W',
    'KO',
]


const moveAnnotationProps = [
    'BM',
    'DO',
    'IT',
    'TE',
]

const timingProps = [
    'BL',
    'OB',
    'WL',
    'OW',
]

const setupProps = [
    'AB',
    'AE',
    'AW',
    'PL',
]

const nodeAnnotationProps = [
    'C',
    'DM',
    'GB',
    'GW',
    'HO',
    'N',
    'UC',
    'V',
]

const markupProps = [
    'AR',
    'CR',
    'DD',
    'LB',
    'LN',
    'MA',
    'SL',
    'SQ',
    'TR',
]

const miscProps = [
    'FG',
    'PM',
    'VW',
]

/**
 * 
 * @param {string} coord Alpha characters
 * @returns {Array} Numeric coordinates
 */
function numericCoord(coord) {
    let numCoord = [];
    for (let i = 0; i < coord.length; i++) {
        numCoord.push(sgfCoord.indexOf(coord[i]));
    }
    return numCoord;
}

/**
 * 
 * @param {string} zipped Compressed coordinates
 * @returns {Array} Uncompressed coordinates
 */
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

/**
 * 
 * @param {{}} props props from game tree node
 * @returns Uncompressed props
 */
function unzipProps(props) {
    for (let key of Object.keys(props)) {
        if (zipable.includes(key)) {
            let newValue = [];
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

function getRoot(props) {
    let rootProps = [];
    for (let key of Object.keys(props)) {
        if (root.includes(key)) {
            rootProps.push(key);
        }
    return rootProps;
    }
}

/**
 * 
 * @param {{}} node Game tree node
 * @returns Formatted game tree node
 */
function formatProps(node) {
    if (node.id === 0) {
        node.props.AP = ['Kosumi:1.0'];
    } else if (node.hasOwnProperty('props')) {
        for (let prop of getRoot(node.props)) {
            console.log(`Error: root ${prop} at node ${node.id}`)
        }
    }
    if (node.hasOwnProperty('props')) {
        node.props = unzipProps(node.props);
    }
    if (node.hasOwnProperty('children')) {
        for (let i=0; i < node.children.length; i++) {
            formatProps(node.children[i]);
        }
    }
    return node;
}

function getNodeById(tree, id) {
    if (tree.id === id) {
        return tree;
    } else {
        if (!tree.hasOwnProperty('children')) {
            return -1;
        } else {
            for (let child of tree.children) {
                let node = getNodeById(child,id);
                if (node !== -1) {
                    return node;
                }
            }
            return -1;
        }
    }
}

function getLastMainNode(tree) {
    if (tree.hasOwnProperty('children')) {
        return getLastMainNode(tree.children[0]);
    } else {
        return tree;
    }
}
export {numericCoord,unzipCoords,formatProps,getNodeById,getLastMainNode,root,sgfCoord}