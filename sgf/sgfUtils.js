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

/**
 * Unzips composed n-dimensional coords 'coord:coord' 
 * into array of n-dimensional coordinate tuples
 * @param {string} zipped Compressed SGF coordinates 'coord:coord'
 * @returns {Array.<number>[]} Array of uncompressed coordinate tuples
 */
function decompress(zipped) {
    const [min,max] = zipped.split(':').map(parseCoord);

    const unzip = (dimension=0) => {
        if (dimension >= min.length) return [[]];
        const coordinates = [];
        const subCoordinates = unzip(dimension+1);
        for (let i = min[dimension]; i <= max[dimension]; i++) {
            coordinates.push(...subCoordinates.map(x => [i, ...x]));
        }
        return coordinates;
    }

    return unzip();
}

export {
    COORDINATES, 
    parseCoord, 
    encodeCoord,
    unzipCoords,
    decompress,
}; 
