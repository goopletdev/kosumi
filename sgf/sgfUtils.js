const COORDINATES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * Converts single SGF coordinate string into single numeric coordinate
 * @param {string} sgfCoord Alpha SGF coordinate string
 * @returns {number[]} Numeric coordinate
 */
function numCoord(sgfCoord) {
    return Array.from(sgfCoord).map(char => COORDINATES.indexOf(char));
}

export {COORDINATES, numCoord}; 
