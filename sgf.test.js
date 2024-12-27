const genParse = require('./general-parse.js');

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

const tokens = [
    {
        "type": "(",
        "depth": 1
    },
    {
        "type": ";",
        "nodeId": 0
    },
    {
        "type": "propertyIdentifier",
        "value": "GM"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "1"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "FF"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "4"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "CA"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "UTF-8"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "AP"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "CGoban:3"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "ST"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "2"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "propertyIdentifier",
        "value": "RU"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "Japanese"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "SZ"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "9"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "KM"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "0.00"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "propertyIdentifier",
        "value": "PW"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "White"
    },
    {
        "type": "]"
    },
    {
        "type": "propertyIdentifier",
        "value": "PB"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "Black"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 1
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ee"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 2
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "eg"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 3
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ec"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "(",
        "depth": 2
    },
    {
        "type": ";",
        "nodeId": 4
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "gf"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 5
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "cf"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 6
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "gd"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 7
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "dh"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 8
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "gb"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 9
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "fb"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 10
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "eh"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "(",
        "depth": 3
    },
    {
        "type": ";",
        "nodeId": 11
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ei"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 12
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "fi"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 13
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "di"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 14
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "dg"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 15
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "fh"
    },
    {
        "type": "]"
    },
    {
        "type": ")",
        "depth": 3
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "(",
        "depth": 3
    },
    {
        "type": ";",
        "nodeId": 16
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "dg"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 17
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "di"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 18
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ci"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 19
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ei"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 20
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ch"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 21
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "ef"
    },
    {
        "type": "]"
    },
    {
        "type": ")",
        "depth": 3
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "(",
        "depth": 3
    },
    {
        "type": ";",
        "nodeId": 22
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "gc"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 23
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "hc"
    },
    {
        "type": "]"
    },
    {
        "type": ")",
        "depth": 3
    },
    {
        "type": ")",
        "depth": 2
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": "(",
        "depth": 2
    },
    {
        "type": ";",
        "nodeId": 24
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "eb"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 25
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "fb"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 26
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "db"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 27
    },
    {
        "type": "propertyIdentifier",
        "value": "B"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "fd"
    },
    {
        "type": "]"
    },
    {
        "type": "newline",
        "value": "\n"
    },
    {
        "type": ";",
        "nodeId": 28
    },
    {
        "type": "propertyIdentifier",
        "value": "W"
    },
    {
        "type": "["
    },
    {
        "type": "propertyValue",
        "value": "cd"
    },
    {
        "type": "]"
    },
    {
        "type": ")",
        "depth": 2
    },
    {
        "type": ")",
        "depth": 1
    },
    {
        "type": "newline",
        "value": "\n"
    }
]

test('Tokenize SGF string', () => {
    genParse.tokenize(rawSGF).then(data => {
        expect(data).toEqual(tokens);
    });
})