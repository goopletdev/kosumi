const COORDINATES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * Converts single SGF coordinate string into single coordinate tuple
 * @param {string} coord alpha SGF coordinate
 * @returns {number[]} coordinate tuple
 */
const parseCoord = (coord) => Array.from(coord).map(char => COORDINATES.indexOf(char));

/**
 * Converts coordinate tuple into an SGF point
 * @param {number[]} coord coordinate tuple
 * @returns {string} alpha SGF coordinate
 */
const encodeCoord = (coord) => coord.map(coord => COORDINATES[coord]).join('');

/**
 * Unzips 'ab:bc' coords into array of tuples [[0,1],[0,2],[1,1],[1,2]]
 * @param {string} zipped Compressed SGF coordinates 'wx:yz'
 * @returns {Array.<[number,number]>} Array of uncompressed coordinate tuples
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
