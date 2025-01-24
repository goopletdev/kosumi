/**
 * @module SGF
 */
import { tokenize, parseTokens, buildGameObject } from "./parse-sgf.js";
import { sgfPropOrder, propertyDefinitions } from "./sgfProperties.js";
import { COORDINATES, numCoord } from "./sgfUtils.js";
const propOrder = sgfPropOrder.flat();
const blackInfo = ['PB','BR','BT'];
const whiteInfo = ['PW','WR','WT'];
const timeInfo = ['TM','OT'];

class SGF {
    static zippableProperties = [
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
    static rootProperties = [
        'FF',
        'GM',
        'AP',
        'CA',
        'ST',
        'SZ',
    ]

    /**
     * Unzips 'ab:bc' coords into array [[0,1],[1,1],[0,2],[2,2]]
     * @param {string} zipped Compressed SGF coordinates 'wx:yz'
     * @returns {string[]} Array of uncompressed SGF coordinates [n,n]
     */
    static unzipCoords(zipped) {
        let coords = zipped.split(':').map(coord => numCoord(coord));
        let unzipped = [];

        for (let x = coords[0][0]; x <= coords[1][0]; x++) {
            for (let y = coords[0][1]; y <= coords[1][1]; y++) {
                unzipped.push([x,y]);
            }
        }

        return unzipped;
    }

    static parseCoord(sgfCoord) {

    }

    static parseValue(propIdent,propVal) {
        return propertyDefinitions[propIdent].parse(propVal);
    }

    /**
     * Encodes a game object as an SGF string
     * @param {object} node Root node of game tree
     * @returns {string} SGF string
     */
    static stringify(node) {
        // begin SGF node
        let sgf = ';';
        if (node.hasOwnProperty('props')) {
            let orderedKeys = [];
            // order properties; purely aesthetic
            for (let propIdent of propOrder) {
                if (Object.keys(node.props).includes(propIdent)) {
                    orderedKeys.push(propIdent);
                } 
            }
            for (let propIdent of Object.keys(node.props)) {
                if (!orderedKeys.includes(propIdent)) {
                    orderedKeys.push(propIdent);
                }
            }
            // change [key, value] objects to 'ID[va][lu][e]' format
            orderedKeys.forEach((key, i) => {
                let suffix = '';
                // style whitespace of root node
                if (node.id === 0 && (
                    !SGF.rootProperties.includes(orderedKeys[i+1]) || !SGF.rootProperties.includes(orderedKeys[i])
                ) && !(blackInfo.includes(orderedKeys[i]) && blackInfo.includes(orderedKeys[i+1])) && !(
                    whiteInfo.includes(orderedKeys[i]) && whiteInfo.includes(orderedKeys[i+1])
                ) && !(timeInfo.includes(orderedKeys[i]) && timeInfo.includes(orderedKeys[i+1]))) {
                    suffix = '\n'; // i apologize for the chaos but it works i swear
                }
                let values = [];
                for (let val of node.props[key]) {
                    // handle escaped characters in PropertyValues and encode numeric coords
                    let newVal = val;
                    if (typeof val !== 'string') {
                        newVal = '';
                        for (let number of val) {
                            newVal += COORDINATES[number];
                        }
                    } 
                    values.push(newVal.replaceAll('\\','\\\\').replaceAll(']','\\]'));
                }
                sgf += `${key}[${values.join('][')}]${suffix}`;
            }) 
        }
        if (node.hasOwnProperty('children')) {
            // root node has trailing newline; add newline only to following nodes
            let newline = node.id > 0 ? '\n' : '';
            let open = '';
            let close = '';
            if (node.children.length > 1) {
                open = '(';
                close = ')';
            }
            for (let child of node.children) {
                sgf += newline + open + SGF.stringify(child) + close;
            }
        }
        if (!node.hasOwnProperty('parent')) {
            sgf = `(${sgf})`;
        }
        return sgf;
    }

    /**
     * Uses SGF.encode on each game object in an array and joins them
     * @param {object[]} gameTrees 
     * @returns {string} SGF collection 
     */
    static encodeCollection(gameTrees) {
        let collection = [];
        for (let tree of gameTrees) {
            collection.push(SGF.stringify(tree));
        }
        return collection.join('\n\n');
    }

    /**
     * Returns array of Game objects from an SGF
     * @param {string} sgf SGF/SGF collection string
     * @param {string} application Name of SGF editor
     * @returns {object[]} Array of game node trees
     */
    static async parse(sgf, application=propertyDefinitions.AP.kosumiDefault) {
        const collection = tokenize(sgf)
        .then(tokens => parseTokens(tokens))
        .then(nodes => buildGameObject(nodes));

        if (application) {
            for (let gameTree of collection) {
                if (!gameTree.hasOwnProperty('props')) {
                    gameTree.props = {};
                }
                gameTree.props.AP = [application];
            }
        }
        return collection;
    }

    static evaluate(node) {

    }
}

export default SGF;