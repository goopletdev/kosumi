class SGF {
    constructor() {

    }

    static sgfCoordinates = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
     * Converts single SGF coordinate string into single numeric coordinate
     * @param {string} sgfCoord Alpha SGF coordinate string
     * @returns {[number,number]} Numeric coordinate
     */
    static numericCoord(sgfCoord) {
        let numCoord = [];
        for (let i=0; i < sgfCoord.length; i++) {
            numCoord.push(this.sgfCoordinates.indexOf(sgfCoord[i]));
        }
        return numCoord;
    }

    /**
     * Unzips 'ab:bc' coords into array ['ab','bb','ac','cc']
     * @param {string} zippedCoords Compressed SGF coordinates [xy:xy]
     * @returns {[string][]} Array of uncompressed SGF coordinates [xy]
     */
    static unzipCoords(zippedCoords) {
        let coords = [];
        let unzipped = [];

        for (let coord of zippedCoords.split(':')) {
            coords.push(this.numericCoord(coord));
        }

        for (let x = coords[0][0]; x <= coords[1][0]; x++) {
            for (let y = coords[0][1]; y <= coords[1][1]; y++) {
                unzipped.push(this.sgfCoordinates[x] + this.sgfCoordinates[y]);
            }
        }

        return unzipped;
    }
}

export default SGF;