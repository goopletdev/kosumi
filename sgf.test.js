const sgf = require('./sgf/sgf.js');

const rawSGF = `(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]
RU[Japanese]SZ[9]KM[0.00]
PW[White]PB[Black]
;B[ee]
;W[eg]
;B[ec]
(;W[gf]
;B[cf]
;W[gd]
;B[dh]
;W[gb]
;B[fb]
;W[eh]
(;B[ei]
;W[fi]
;B[di]
;W[dg]
;B[fh])
(;B[dg]
;W[di]
;B[ci]
;W[ei]
;B[ch]
;W[ef])
(;B[gc]
;W[hc]))
(;W[eb]
;B[fb]
;W[db]
;B[fd]
;W[cd]))
`
const formattedSGF = `(;FF[4]GM[1]AP[Kosumi:0.1.0]CA[UTF-8]ST[2]SZ[9]
PB[Black]
PW[White]
RU[Japanese]
KM[0.00]
;B[ee]
;W[eg]
;B[ec]
(;W[gf]
;B[cf]
;W[gd]
;B[dh]
;W[gb]
;B[fb]
;W[eh]
(;B[ei]
;W[fi]
;B[di]
;W[dg]
;B[fh])
(;B[dg]
;W[di]
;B[ci]
;W[ei]
;B[ch]
;W[ef])
(;B[gc]
;W[hc]))
(;W[eb]
;B[fb]
;W[db]
;B[fd]
;W[cd]))`

const gameObject = sgf.parse(rawSGF);

test('Parses and stringifies sgf string', () => {
    expect(sgf.stringify(gameObject)).toBe(formattedSGF);
});