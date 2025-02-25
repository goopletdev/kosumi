import Gnode from "../gnode/gnode-class.js";

describe('Gnode tree construction', () => {
    let node0;
    beforeEach(() => {
        node0 = new Gnode({id:0});
    });
    it('should have an undefined parent', () => {
        expect(node0.parent).toEqual(undefined);
        expect(node0.root).toEqual(node0);
    });
    it('should have an empty children array', () => {
        expect(node0.children).toEqual([]);
        expect(node0.children.length).toEqual(0);
    });
    it('should take other Gnode objects as children', () => {
        const node1 = new Gnode({id: 1},node0);
        node0.mainBranch = node1;
        expect(node0.mainBranch).toEqual(node1);
        expect(node1.parent).toEqual(node0);
        expect(node1.root).toEqual(node0);
        expect(node0.terminal()).toEqual(node1);
    });
});

describe('Large 1-branch Gnode tree', () => {
    const nodes = [];
    beforeEach(() => {
        nodes.length = 0;
        nodes.push(new Gnode({id:0}));
        for (let i=1; i < 10; i++) {
            nodes.push(new Gnode({id:i},nodes[i-1]));
            nodes[i-1].mainBranch = nodes[i];
        }
    });
    it('should properly calculate depth and length from each node', () => {
        expect(nodes[0].depth()).toEqual(0);
        expect(nodes[1].depth()).toEqual(1);
        expect(nodes[2].branchLength()).toEqual(10);
    });
    it('should handle tree traversal', () => {
        expect(nodes[2].terminal()).toEqual(nodes[9]);
        expect(nodes[5].root).toEqual(nodes[0]);
        expect(nodes[6].parent).toEqual(nodes[5]);
        expect(nodes[4].mainBranch).toEqual(nodes[5]);
    });
    it('should handle searching for properties', () => {
        expect(nodes[6].searchBranch('id',8)).toEqual(nodes[8]);
        expect(nodes[6].searchBranch('id',6)).toEqual(nodes[6]);
        expect(nodes[6].searchBranch('id',3)).toEqual(nodes[3]);
        expect(nodes[6].searchDownBranch('id',2)).toEqual(null);
    });

});