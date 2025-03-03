import GameEngine from "../stoneWalker/game-engine-class";

// rewrite these tests such that they don't depend on each other

describe('Goban methods on 5x5', () => {
    /*let board;
    beforeEach(() => {
        board = new Goban(5);
    });*/

    let board = new GameEngine(5);

    it('should make an empty array of length 25', () => {
        expect(board.arr.length).toEqual(25);
        expect(board.arr.every(v => v === 0)).toBe(true);
        expect(board.width).toBe(5);
    });

    it('should flatten 2d coordinates to a single number', () => {
        expect(board.flatten([2,3])).toBe(17);
    });

    it('should unflatten fCoord to 2d coordinate', () => {
        expect(board.unflatten(17)).toEqual([2,3]);
    });

    it('should return 2-4 neighbors for a given point', () => {
        expect(board.neighbors(12)).toEqual([7,11,13,17]);
        expect(board.neighbors(4)).toEqual([3,9]);
        expect(board.neighbors(21)).toEqual([16,20,22]);
    });

    it('should mutate state to place setup stones', () => {
        expect(board.setup(1,12,7,2,3,24)).toEqual([
            0,0,1,1,0,
            0,0,1,0,0,
            0,0,1,0,0,
            0,0,0,0,0,
            0,0,0,0,1,
        ]);
        expect(board.setup(2,13,8,9,10)).toEqual([
            0,0,1,1,0,
            0,0,1,2,2,
            2,0,1,2,0,
            0,0,0,0,0,
            0,0,0,0,1,
        ]);
    });

    it('should return up to 4 links of orthogonally adjacent friendly stones', () => {
        expect(board.links(7)).toEqual([2,12]);
        expect(board.links(0)).toEqual([]);
        expect(board.links(24)).toEqual([]);
        expect(board.links(9)).toEqual([8]);
    });

    it('should return all points in the same chain as the given fcoord', () => {
        expect(Array.from(board.chain(7)).sort((a,b) => a-b)).toEqual([2,3,7,12]);
        expect([...board.chain(20)]).toEqual([]);
        expect([...board.chain(10)]).toEqual([10]);
    });

    it('should return all liberties of a given coord\'s chain', () => {
        expect([...board.liberties(2)]).toEqual([1,4,6,11,17]);
        expect([...board.liberties(24)]).toEqual([19,23]);
        expect([...board.liberties(6)]).toEqual([]);
    });

    it('should allow non-capturing moves to behave like setup moves', () => {
        expect([...board.move(1,0,6)]).toEqual([]);
        expect(board.arr).toEqual([
            1,0,1,1,0,
            0,1,1,2,2,
            2,0,1,2,0,
            0,0,0,0,0,
            0,0,0,0,1,
        ]);
    });

    it('should allow suicide moves', () => {
        expect([...board.move(2,1)]).toEqual([1]);
        expect(board.arr).toEqual([
            1,0,1,1,0,
            0,1,1,2,2,
            2,0,1,2,0,
            0,0,0,0,0,
            0,0,0,0,1,
        ]);
    });

    it('should handle captures correctly', () => {
        expect([...board.move(2,1,5)]).toEqual([0]);
        expect(board.arr).toEqual([
            0,2,1,1,0,
            2,1,1,2,2,
            2,0,1,2,0,
            0,0,0,0,0,
            0,0,0,0,1,
        ]);
        expect([...board.move(2,11,17,4)].sort((a,b) => a - b)).toEqual([2,3,6,7,12]);
        expect(board.arr).toEqual([
            0,2,0,0,2,
            2,0,0,2,2,
            2,2,0,2,0,
            0,0,2,0,0,
            0,0,0,0,1,
        ]);
        expect([...board.move(1,0,2,6)]).toEqual([1]);
    });

    it('should throw if attempt to place stone on occupied intersection', () => {
        expect(() => board.move(1,5)).toThrow();
    });
});