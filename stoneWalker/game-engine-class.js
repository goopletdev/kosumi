/**
 * @module GameEngine
 */
import Flatrix from "../flatrix/flatrix.js";

class GameEngine extends Flatrix {
    /**
     * Sets goban width and initializes a flattened board state with 0's
     * @param {number} width X; number of columns
     * @param {number} height Y; number of rows
     */
    constructor (width=19, height=width) {
        super(Array(width * height).fill(0), width);
    }

    /**
     * @readonly alias for this.arr
     * @type {Array.<any>}
     */
    get state () {
        return this.arr;
    }

    /**
     * Clears boardstate
     * @returns {Array.<0>} sets all elements of state to 0
     */
    clear() {
        return this.state.fill(0);
    }

    /**
     * Finds all orthogonally adjacent intersections to a given point
     * @param {number} fCoord Flattened coordinate
     * @returns {Array.<number>} Orthogonally adjacent intersections
     */
    neighbors (fCoord) {
        const adjacent = [];
        const [x,y] = this.unflatten(fCoord);
        if (y > 0) adjacent.push(this.flatten([x,y-1]));
        if (x > 0) adjacent.push(this.flatten([x-1,y]));
        if (x < this.width - 1) adjacent.push(this.flatten([x+1,y]));
        if (y < this.height - 1) adjacent.push(this.flatten([x,y+1]));

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
            this.neighbors(move).forEach(n => {
                const color = this.state[n];
                if (!color || color === value || this.liberties(n).size) return;
                if (!captures[color]) captures[color] = new Set();
                else if (captures[color].has(n)) return;
                
                this.chain(n).forEach(link => captures[color].add(link));
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
}

export default GameEngine;