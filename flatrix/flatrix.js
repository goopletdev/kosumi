/**
 * @module Flatrix common flat matrix rotation methods
 */

export default class Flatrix {
    #width;
    #arr;

    /**
     * Initialize width and array of Flatrix object
     * @param {any[]} array Flattened array
     * @param {number} width number of columns
     * @throws If width doesn't allow for positive integer height
     */
    constructor (array, width = Math.sqrt(array.length)) {
        if (width < 1 || width % 1 || array % width) {
            throw new Error(`width ${width} is not allowed`);
        }
        this.#width = width;
        this.#arr = array;
    }

    /**
     * Convert a 2-d matrix into a Flatrix object
     * @param {Array.<any[]>} matrix 2-dimensional matrix
     * @returns {Flatrix} New Flatrix object
     */
    from (matrix) {
        return new Flatrix(matrix.flat(), matrix[0].length);
    }

    /**
     * @readonly
     * @type {number}
     */
    get width () {
        return this.#width;
    }

    /**
     * @readonly
     * @type {[]}
     */
    get arr () {
        return this.#arr;
    }

    /**
     * @readonly
     * @type {number}
     */
    get height () {
        return this.arr.length / this.#width;
    }

    /**
     * @readonly
     * @type {number}
     */
    get size () {
        return this.arr.length;
    }

    /**
     * Unflattens a given flat coord, 
     * or returns a 2d matrix if not passed any args
     * @param {number} [fCoord=undefined] Flattened coordinate
     * @param {boolean} [rotated=false] if true, finds x,y of c w/ swapped w,h
     * @returns {
     * [number, number] | Array.<any[]>
     * }
     */
    unflatten (fCoord, rotated=false) {
        if (typeof fCoord === 'number') {
            const w = rotated ? this.height : this.width;
            const x = fCoord % w;
            return [x, (fCoord - x) / w];
        } else if (typeof fCoord !== 'undefined') {
            throw new Error (`arg ${fCoord} not allowed`);
        }

        const matrix = new Array();

        for (let i = 0; i < this.arr.length; i++) {
            if (!(i % this.width)) matrix.push([]);
            matrix[matrix.length-1].push(this.arr[i]);
        }

        return matrix;
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
     * Gets the value of this.arr at the given coordinate
     * @param {number} x 
     * @param {number} y 
     * @returns {any} Value of this.arr at coordinate
     */
    at (x,y) {
        return this.arr[this.flatten([x,y])];
    }

    /**
     * Rotates a 1-dimensional flattened matrix in place
     * @param {boolean} clockwise defaults to clockwise rotation
     * @returns {any[]} this.arr
     */
    rotate (clockwise = true) {
        const rearranged = new Set();

        /***
         * Rotates coordinates that have a 'rotation relationship' recursively
         * @param {number} c Flat coordinate
         * @returns {any} initial value of arr[c]
         */
        const rotate =  (c) => {
            const val = this.arr[c];
            if (rearranged.has(c)) {
                if (rearranged.size < this.arr.length) rotate(c + 1);
                return val;
            }
            rearranged.add(c);

            // calculate [x,y] coords of c flat coord in new rotated dimensions
            const [x,y] = this.unflatten(c,true);
            this.arr[c] = rotate(y + (this.height - 1 - x) * this.width);          
            return val;
        }

        rotate(0);
        if (!clockwise) this.arr.reverse();
        this.#width = this.height;

        return this.arr;
    }

    /**
     * Returns subflatrix of given dimensions starting on given coord
     * @param {number} fcoord Top-left coordinate of subarray
     * @param {number} width width of subflatrix
     * @param {number} [height=width] height of subflatrix
     * @returns {Flatrix} subflatrix
     */
    slice (fcoord, width, height=width) {
        const subTrix = new Flatrix(Array(width*height),width);

        for (let i=0; i < subTrix.arr.length; i++) {
            if (i % width) {
                fcoord++;
            } else if (i) fcoord += 1 + this.width - width;
            subTrix.arr[i] = this.arr[fcoord];
        }

        return subTrix;
    }

    /**
     * Pastes flatrix.arr onto this.arr starting at fcoord
     * @param {number} fcoord starting point of this.arr to paste subarray
     * @param {(Flatrix | {[], number})} param1 Flatrix object
     */
    paste (fcoord, { arr, width, height = arr.length/width }) {
        const [x,y] = this.unflatten(fcoord);
        if ((x + width) > this.width || (y + height) >= this.height) {
            throw new Error(`pasted array too large`);
        }
        for (let i=0; i < arr.length; i++) {
            if (i % width) {
                fcoord++;
            } else if (i) fcoord += 1 + this.width - width;
            this.arr[fcoord] = arr[i];
        }
    }

    /**
     * Mirrors this.arr in place
     * @param {(
     * 'vertical' | 'horizontal' | 'diagonal00_NN' | 'diagonal0N_N0'
     * )} axis Point of mirroring
     * @returns mutated this.arr
     * @throws Will throw an error if 'axis' is not recognized
     */
    mirror (axis = 'vertical') {
        for (let i=0; i < this.height; i++) {
            const pos = i * this.width;
            for (let j = pos; j < pos + Math.floor(this.width/2); j++) {
                const mirror = pos + this.width - j % this.width - 1;
                [this.arr[j],this.arr[mirror]] = [this.arr[mirror],this.arr[j]];
            }
        }

        switch (axis) {
            case 'vertical': return this.arr;
            case 'horizontal': return this.arr.reverse();
            case 'diagonal00_NN': return this.rotate(false);
            case 'diagonal0N_N0': return this.rotate();
            default: throw new Error(`axis ${axis} not recognized`);
        }
    }
}

export default Flatrix;