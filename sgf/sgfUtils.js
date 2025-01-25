const COORDINATES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * Converts single SGF coordinate string into single coordinate tuple
 * @param {string} sgfCoord alpha SGF coordinate
 * @returns {number[]} coordinate tuple
 */
function parseCoord(sgfCoord) {
    return Array.from(sgfCoord).map(char => COORDINATES.indexOf(char));
}

/**
 * Converts coordinate tuple into an SGF point
 * @param {number[]} coords Tuple indicating a specific point on the board
 * @returns {string} alpha SGF coordinate
 */
function encodeCoord(coords) {
    return coords.map(coord => COORDINATES[coord]).join('');
} 

/**
 * Unzips 'ab:bc' coords into array of tuples [[0,1],[1,1],[0,2],[2,2]]
 * @param {string} zipped Compressed SGF coordinates 'wx:yz'
 * @returns {string[]} Array of uncompressed coordinate tuples [n,n]
 */
function unzipCoords(zipped) {
    const [min,max] = zipped.split(':').map(parseCoord);
    let unzipped = [];

    for (let x = min[0]; x <= max[0]; x++) {
        for (let y = min[1]; y <= max[1]; y++) {
            unzipped.push([x,y]);
        }
    }

    return unzipped;
}

/*
function recurseZippedCoords(zipped) {
    //idk how to make this work but imma figure it out eventually
    // unzipCoords() limits us to 2d grids
    const [start,end] = zipped.split(':').map(parseCoord);
    const dimensions = min.length;

    const unzip = (pos = 0) => {
        const [min, max] = [start[pos],end[pos]];
        const coords = Array.from({length: max-min}, (_,i) => i+min).reduce((acc,curr) => {
            pos < dimensions - 1 ? acc.push(curr, ...unzip(pos+1)) : acc.push(curr);
        });
    }

    return unzip();
}
*/

export {
    COORDINATES, 
    parseCoord, 
    encodeCoord,
    unzipCoords,
}; 
