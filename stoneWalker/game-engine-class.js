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
        const coords=[];

        const search = (coord) => {
            coords.push(coord);
            this.links(coord).forEach(link => {
                if (!coords.includes(link)) search(link);
            });
        }

        if (this.state[fCoord]) search(fCoord);

        return coords;
    }

    /**
     * Find chain's unoccupied adjacent intersections 
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} Chain's liberties
     */
    getLiberties (fCoord) {
        const dame = []; // array of chain's liberties
        if (!this.state[fCoord]) return dame;
        
        this.getChain(fCoord).forEach(link => {
            this.neighbors(link).forEach(neighbor => {
                if (dame.includes(neighbor) || this.state[neighbor]) return;
                dame.push(neighbor);
            });
        });

        return dame;
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
     * Mutates game state by placing stones, then removes captures.
     * Allows for suicide moves, and notably for multiple simultaneous
     * moves (for variants).
     * @param {1 | 2} value Color/player number
     * @param  {...number} fCoords 
     * @returns {(Array.<number> | undefined)[]} captured stones
     * @throws on an attempt to place a stone on an occupied intersection
     */
    move (value, ...fCoords) {
        // validate and place moves
        fCoords.forEach(c => {
            if (this.state[c]) throw new Error(`Intersection ${c} is already occupied`);
            this.state[c] = value;
        });

        // track captures by color
        const captures = [,];

        // check for opponent captures
        fCoords.forEach(move => {
            this.neighbors(move).forEach(neighbor => {
                const color = this.state[neighbor];
                if (!color || color === value) return;
                if (this.getLiberties(neighbor).length) return;
                if (!captures[color]) {
                    captures[color] = new Set();
                } else if (captures[color].has(neighbor)) return;
                
                this.getChain(neighbor).forEach(link => {
                    console.log(link);
                    captures[color].add(link);
                });
            });
        });

        // remove captures from board
        captures.forEach(color => {
            if (!color) return;
            color.forEach(stone => this.state[stone] = 0);
        });

        // check for self-captured stones
        fCoords.forEach(stone => {
            if (this.getLiberties(stone).length) return;
            if (!captures[value]) captures[value] = new Set();
            this.getChain(stone).forEach(link => captures[value].add(link));
        });

        // remove self-captures from board
        captures[value]?.forEach(stone => this.state[stone] = 0);

        return captures;
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
     * Sets given state to new Goban object and returns Goban
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