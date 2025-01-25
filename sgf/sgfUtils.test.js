import { parseCoord, encodeCoord, unzipCoords } from "./sgfUtils.js"

describe("SGF utility functions", () => {
    test("parseCoord", () => {
        expect(parseCoord("aa")).toEqual([0, 0]);
        expect(parseCoord("AA")).toEqual([26, 26]);
        expect(parseCoord("tt")).toEqual([19, 19]);
    });

    test("encodeCoord", () => {
        expect(encodeCoord([1,2])).toEqual('bc');
        expect(encodeCoord([18,18])).toEqual('ss');
        expect(encodeCoord([0,5])).toEqual('af');
    });

    test("unzipCoords", () => {
        expect(unzipCoords('ab:bc')).toEqual([[0,1],[0,2],[1,1],[1,2]]);
        expect(unzipCoords('aa:bb')).toEqual([[0,0],[0,1],[1,0],[1,1]]);
        expect(unzipCoords('bb:bd')).toEqual([[1,1],[1,2],[1,3]]);
    });
});