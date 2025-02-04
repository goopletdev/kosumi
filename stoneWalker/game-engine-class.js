/**
 * @module GameEngine
 */

class GameEngine {
    /**
     * Sets goban width and initializes a flattened board state with 0's
     * @param {number} width X; number of columns
     * @param {number} height Y; number of 
     */
    constructor (width=19, height=width) {
        this.dimensions = [width,height];
    }

    set width (width) {
        this._width = width;
        this.state = Array(width * height).fill(0);
    }

    get width () {
        return this._width;
    }

    set height (height) {
        this._height = height;
        this.state = Array(width * height).fill(0);
    }

    get height () {
        return this._height;
    }

    set dimensions ([width,height]) {
        this._width = width;
        this._height = height;
        this.state = Array(width * height).fill(0);
    }

    get dimensions () {
        return [this.width, this.height];
    }

    /**
     * Clears boardstate
     * @returns {Array.<0>} sets all elements of state to 0
     */
    clear() {
        return this.state.fill(0);
    }

    /**
     * Flattens 2-d coordinates to a single number
     * @param {[number,number]} coordinate
     * @returns {number} flattened coordinate
     */
    flatten ([x,y]) {
        return x + y * this._width;
    }

    /**
     * Unflattens coordinate
     * @param {number} fCoord flattened coordinate
     * @returns {[number,number]} Unflattened 2-d coordinate
     */
    deepen (fCoord) {
        return [fCoord % this._width, Math.floor(fCoord / this._width)];
    }

    /**
     * Finds all orthogonally adjacent points to a given point
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} Orthogonally adjacent intersections
     */
    neighbors (fCoord) {
        const adjacent = [];
        const [width,size] = [this._width,this.state.length];

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
     * @returns {Set.<number>} All the stones in a chain of stones
     */
    chain (fCoord) {
        const coords = new Set();

        const search = (coord) => {
            coords.add(coord);
            this.links(coord).forEach(link => {
                if (!coords.has(link)) search(link);
            });
        }

        if (this.state[fCoord]) search(fCoord);

        return coords;
    }

    /**
     * Find chain's unoccupied adjacent intersections 
     * @param {number} fCoord Flattened coordinate
     * @returns {Set<number>} Chain's liberties
     */
    liberties (fCoord) {
        const coords = new Set(); // set of chain's liberties
        if (!this.state[fCoord]) return coords;
        
        this.chain(fCoord).forEach(link => {
            this.neighbors(link).forEach(neighbor => {
                if (coords.has(neighbor) || this.state[neighbor]) return;
                coords.add(neighbor);
            });
        });

        return coords;
    }

    /**
     * Mutates goban.state; sets state at fcoords to value
     * @param {number} value Color or empty; 0,1, or 2
     * @param  {...number} fCoords fcoords to set
     * @returns {Array.<number>} this.state
     */
    setup (value, ...fCoords) {
        fCoords.forEach(coord => {
            if (this.state[coord] === value) {
                this.state[coord] = 0;
            } else {
                this.state[coord] = value;
            }
        });
        return this.state;
    }

    /**
     * Mutates game state by placing stones, then removes captures.
     * Allows for suicide moves, and notably for multiple simultaneous
     * moves (for variants).
     * @param {number} value Color/player number
     * @param  {...number} fCoords 
     * @returns {(Set.<number> | undefined)[]} captured stones
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
                if (this.liberties(neighbor).size) return;
                if (!captures[color]) {
                    captures[color] = new Set();
                } else if (captures[color].has(neighbor)) return;
                
                this.chain(neighbor).forEach(link => {
                    captures[color].add(link);
                });
            });
        });

        // remove captures from board
        captures.forEach(color => {
            if (color) color.forEach(stone => this.state[stone] = 0);
        });

        // check for self-captured stones
        fCoords.forEach(stone => {
            if (this.liberties(stone).size) return;
            if (!captures[value]) captures[value] = new Set();
            this.chain(stone).forEach(link => captures[value].add(link));
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
     * @returns {GameEngine} Goban object with the given state
     */
    static from (state) {
        const board = new GameEngine;
        board.state = state;
        board._width = Math.sqrt(state.length);
        return board;
    }
}

export default GameEngine;