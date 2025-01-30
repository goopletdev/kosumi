/**
 * @module Goban
 */

class Goban {
    /**
     * Sets goban width and initializes a flattened board state with 0's
     * @param {number} width X; number of columns
     * @param {number} height Y; number of 
     */
    constructor (width=19, height=width) {
        this.width = width;
        this.state = Array(width * height).fill(0);
    }

    /**
     * Flattens 2-d coordinates to a single number
     * @param {[number,number]} coordinate
     * @returns {number} flattened coordinate
     */
    flatten ([x,y]) {
        return x + y * this.width;
    }

    /**
     * Unflattens coordinate
     * @param {number} fCoord flattened coordinate
     * @returns {[number,number]} Unflattened 2-d coordinate
     */
    deepen (fCoord) {
        return [fCoord % this.width, Math.floor(fCoord / this.width)];
    }

    /**
     * Finds all orthogonally adjacent points to a given point
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} Orthogonally adjacent intersections
     */
    neighbors (fCoord) {
        const adjacent = [];
        const [width,size] = [this.width,this.state.length];

        if (fCoord-width >= 0 && fCoord-width < size) {
            adjacent.push(fCoord-width);
        }
        if (fCoord % width) {
            adjacent.push(fCoord - 1);
        }
        if ((fCoord + 1) % width) {
            adjacent.push(fCoord + 1);
        }
        if (fCoord+width >= 0 && fCoord+width < size) {
            adjacent.push(fCoord+width);
        }

        return adjacent;
    }

    /**
     * Finds friendly neighbors to given coordinate
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} Friendly neighbors
     */
    links (fCoord) {
        if (!this.state[fCoord]) return [];
        const adjacent = this.neighbors(fCoord);
        return adjacent.filter(c => this.state[c] === this.state[fCoord]);
    }

    /**
     * Finds all stones in a chain
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} All the stones in a chain of stones
     */
    getChain (fCoord) {
        const chain=[];

        const search = (coord) => {
            chain.push(coord);
            this.links(coord).forEach(link => {
                if (!chain.includes(link)) search(link);
            });
        }

        if (this.state[fCoord]) search(fCoord);

        return chain;
    }

    /**
     * Mutates goban.state; sets state at fcoords to value
     * @param {number} value Color or empty; 0,1, or 2
     * @param  {...number} fCoords fcoords to set
     * @returns {Array.<number>} this.state
     */
    setup (value, ...fCoords) {
        fCoords.forEach(coord => this.state[coord] = value);
        return this.state;
    }

    /**
     * Stringifies boardstate for display
     * @returns {string} consisting of '.','B','W','\n'
     */
    prettify () {
        let pretty = '';
        this.state.forEach((value, i) => {
            pretty += ['.','B','W'][value];
            if (i < this.state.length - 1 && !((i+1) % width)) pretty += '\n';
        });
        return pretty;
    }

    /**
     * Sets given state 
     * @param {Array.<number>} state Flat square array
     * @returns {Goban} Goban object with the given state
     */
    static from (state) {
        const board = new Goban;
        board.state = state;
        board.width = Math.sqrt(state.length);
        return board;
    }
}

export default Goban;