import Goban from "./game-engine-class";

describe('Goban static methods', () => {
    it('should make a Goban object from a flat square array', () => {
        let board = Goban.from([0,0,1,0,0,0,1,1,1]);
        expect(board.width).toBe(3);
        expect(board.state).toEqual([0,0,1,0,0,0,1,1,1]);
    });
});

describe('Goban methods on 5x5', () => {
    /*let board;
    beforeEach(() => {
        board = new Goban(5);
    });*/

    let board = new Goban(5);

    it('should make an empty array of length 25', () => {
        expect(board.state.length).toEqual(25);
        expect(board.state.every(v => v === 0)).toBe(true);
        expect(board.width).toBe(5);
    });

    it('should flatten 2d coordinates to a single number', () => {
        expect(board.flatten([2,3])).toBe(17);
    });

    it('should unflatten fCoord to 2d coordinate', () => {
        expect(board.deepen(17)).toEqual([2,3]);
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
        expect(board.getChain(7).sort((a,b) => a-b)).toEqual([2,3,7,12]);
        expect(board.getChain(20)).toEqual([]);
        expect(board.getChain(10)).toEqual([10]);
    });
});