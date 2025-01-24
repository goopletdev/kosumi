import { numCoord } from "./sgfUtils.js"

test("numCoord", () => {
    expect(numCoord("aa")).toEqual([0, 0]);
    expect(numCoord("AA")).toEqual([26, 26]);
    expect(numCoord("tt")).toEqual([19, 19]);
});
