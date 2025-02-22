import Flatrix from "../flatrix/flatrix.js";

describe('Flatrix instance methods for a square matrix', () => {
    let squareBoi;
    beforeEach(() => {
        squareBoi = new Flatrix([
            1,2,3,
            4,5,6,
            7,8,9,
        ]);
    });
    it('initializes a Flatrix instance w/ equal height and width', () => {
        expect([squareBoi.width,squareBoi.height]).toEqual([3,3]);
    });
    it('unflattens the array into a 2d matrix', () => {
        expect(squareBoi.unflatten()).toEqual([
            [1,2,3],
            [4,5,6],
            [7,8,9],
        ]);
    });
    it('rotates clockwise in-place and returns this.arr', () => {
        expect(squareBoi.rotate()).toEqual([
            7,4,1,
            8,5,2,
            9,6,3,
        ]);
    });
    it('rotates counterclockwise as well', () => {
        expect(squareBoi.rotate(false)).toEqual([
            3,6,9,
            2,5,8,
            1,4,7,
        ]);
    });
});

describe('Non-square rectangular Flatrix instances', () => {
    it('throws error if given non-square flat matrix w/o width', () => {
        expect(() => new Flatrix([
            1,2,3,
            4,5,6,
        ])).toThrow(`width ${Math.sqrt(6)} is not allowed`);
    });
    it('rotates flatrix and swaps width/height', () => {
        const rectangleBoi = new Flatrix([
            1,2,3,4,
            5,6,7,8,
        ],4);
        expect(rectangleBoi.arr).toEqual([
            1,2,3,4,
            5,6,7,8,
        ]);
        expect(rectangleBoi.width).toEqual(4);
        expect(rectangleBoi.height).toEqual(2);
        rectangleBoi.rotate();
        expect(rectangleBoi.arr).toEqual([
            5,1,
            6,2,
            7,3,
            8,4,
        ]);
        expect([rectangleBoi.width,rectangleBoi.height]).toEqual([2,4]);
    });
    it('rotates rectangular flatrix counterclockwise', () => {

        const boi = new Flatrix([
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9,
            10,11,12,13,14,
        ],5);
        boi.rotate(false);
        expect(boi.arr).toEqual([
            4, 9, 14,
            3, 8, 13,
            2, 7, 12,
            1, 6, 11,
            0, 5, 10,
        ]);
    });
});

describe('Handles 1-dimensional matrixes', () => {
    it('counts dimensions of initialized arrays', () => {
        const emptyBoi = new Flatrix([,,,,],1);
        expect(emptyBoi.width).toEqual(1);
        expect(emptyBoi.height).toEqual(4);
        emptyBoi.rotate();
        expect(emptyBoi.width).toEqual(4);
    });
    it('only reverses array order when shifting from greater height to greater width', () => {
        const horizontal1dBoi = new Flatrix([1,2,3],3);
        expect(horizontal1dBoi.rotate()).toEqual([1,2,3]);
        const vertical1dBoi = new Flatrix([1,2,3],1);
        expect(vertical1dBoi.rotate()).toEqual([3,2,1]);
    });
});

describe('Slice sub-array from flatrix starting at fcoord', () => {
    it('returns a square flatrix given only 2 args', () => {
        const fboi = new Flatrix([
            1,2,3,
            4,5,6,
            7,8,9,
        ],3);
        expect(fboi.slice(1,2).arr).toEqual([
            2,3,
            5,6,
        ]);
        expect(fboi.slice(0,3).arr).toEqual([
            1,2,3,
            4,5,6,
            7,8,9,
        ]);
    });
    it('handles rectangular slices given 3 args', () => {
        const fboi = new Flatrix([
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,11,
            12,13,14,15,16,17,
            18,19,20,21,22,23,
            24,25,26,27,28,29,
        ],6);
        expect(fboi.slice(8,3,2).arr).toEqual([
            8, 9, 10,
            14,15,16,
        ]);
        expect(fboi.slice(12,6,3).arr).toEqual([
            12,13,14,15,16,17,
            18,19,20,21,22,23,
            24,25,26,27,28,29,
        ]);
    });
});

describe('paste subarray onto flatrix.arr', () => {
    it('allows pasting a previously-sliced and mutated flatrix', () => {
        const fboi = new Flatrix([
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,11,
            12,13,14,15,16,17,
            18,19,20,21,22,23,
            24,25,26,27,28,29,
            30,31,32,33,34,35,
        ],6);
        const subTrix = fboi.slice(20,2);
        expect(subTrix.arr).toEqual([
            20,21,
            26,27,
        ]);
        subTrix.rotate();
        expect(subTrix.arr).toEqual([
            26,20,
            27,21,
        ]);
        fboi.paste(20,subTrix);
        expect(fboi.arr).toEqual([
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,11,
            12,13,14,15,16,17,
            18,19,26,20,22,23,
            24,25,27,21,28,29,
            30,31,32,33,34,35,
        ]);
    });
});

describe('mirroring Flatrix in place', () => {
    let boi;
    beforeEach(() => {
        boi = new Flatrix([
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9,
            10,11,12,13,14,
            15,16,17,18,19,
            20,21,22,23,24,
        ],5);
    });
    it('mirrors along the vertical axis', () => {
        expect(boi.mirror()).toEqual([
            4, 3, 2, 1, 0,
            9, 8, 7, 6, 5,
            14,13,12,11,10,
            19,18,17,16,15,
            24,23,22,21,20,
        ]);
    });
    it('mirrors along the horizontal axis', () => {
        expect(boi.mirror('horizontal')).toEqual([
            20,21,22,23,24,
            15,16,17,18,19,
            10,11,12,13,14,
            5, 6, 7, 8, 9,
            0, 1, 2, 3, 4,
        ]);
    });
    it('mirrors along the 00-NN diagonal', () => {
        expect(boi.mirror('diagonal00_NN')).toEqual([
            0, 5, 10,15,20,
            1, 6, 11,16,21,
            2, 7, 12,17,22,
            3, 8, 13,18,23,
            4, 9, 14,19,24,
        ]);
    });
    it('mirrors along the 0N-N0 diagonal', () => {
        expect(boi.mirror('diagonal0N_N0')).toEqual([
            24,19,14,9, 4,
            23,18,13,8, 3,
            22,17,12,7, 2,
            21,16,11,6, 1,
            20,15,10,5, 0,
        ]);
    });
});