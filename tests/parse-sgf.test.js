import { buildGameObject, parseTokens, tokenize, buildGnodeTree } from '../sgf/parse-sgf.js';

describe('tokenize function', () => {
  test('should tokenize a simple SGF string with a single property', () => {
    const sgf = '(;FF[4])';
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'FF' },
      { type: 'propVal', value: '4' },
      { type: 'terminal', value: ')' },
    ];
    expect(tokenize(sgf)).toEqual(expectedTokens);
  });

  test('should handle escaped characters within property values', () => {
    const sgf = String.raw`(;C[This is a comment with an escaped newline\
and a colon\:])`;
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'C' },
      { type: 'propVal', value: 'This is a comment with an escaped newlineand a colon<ESCAPEDCOLON>' },
      { type: 'terminal', value: ')' },
    ];
    expect(tokenize(sgf)).toEqual(expectedTokens);
  });

  test('should throw an error for missing closing bracket', () => {
    const sgf = '(;C[Missing closing bracket)';
    expect(() => tokenize(sgf)).toThrow("missing ']'");
  });

  test('should throw an error for property ID without value', () => {
    const sgf = '(;FF)';
    expect(() => tokenize(sgf)).toThrow('expecting propVal after propId');
  });
});

describe('parseTokens function', () => {
  test('should handle an SGF with a single empty node', () => {
    const tokens = tokenize('(;)');
    expect(parseTokens(tokens)).toEqual([ "(", { "id": 0 }, ")" ]);
  });
  
  test('should handle multiple propIds on each node', () => {
    const tokens = tokenize(`(;FF[4]GM[1]\n;B[cd]\n;AW[hi:lm]AB[rs]AE[cd])`);
    expect(parseTokens(tokens)).toEqual([
      "(",
      { "id":0,"props":{ "FF":[4],"GM":[1] }},
      {"id":1,"props":{"B":[[2,3]]}},
      {"id":2,"props":{"AW":[[7,8],[7,9],[7,10],[7,11],[7,12],[8,8],[8,9],[8,10],[8,11],[8,12],[9,8],[9,9],[9,10],[9,11],[9,12],[10,8],[10,9],[10,10],[10,11],[10,12],[11,8],[11,9],[11,10],[11,11],[11,12]],"AB":[[17,18]],"AE":[[2,3]]}},
      ")"
    ]);
  });

  test('should handle a variety of escaped chars', () => {
    const tokens = tokenize(String.raw`(;FF[4];C[escaped linebreak\
and colon \: and closeBracket\]])`);
    const nodes = [
      "(",
      { "id": 0,"props": { "FF": [4] } },
      { "id": 1,"props": { "C": ["escaped linebreakand colon : and closeBracket]"] } },
      ")"
  ]
    expect(parseTokens(tokens)).toEqual(nodes);
  });
});

describe('running 3 functions in tandem', () => {
  const sgf = `(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]
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
`;
  const tokens = [
    {"type":"terminal","value":"("},
    {"type":"terminal","value":";"},
    {"type":"propId","value":"GM"},
    {"type":"propVal","value":"1"},
    {"type":"propId","value":"FF"},
    {"type":"propVal","value":"4"},
    {"type":"propId","value":"CA"},
    {"type":"propVal","value":"UTF-8"},
    {"type":"propId","value":"AP"},
    {"type":"propVal","value":"CGoban:3"},
    {"type":"propId","value":"ST"},
    {"type":"propVal","value":"2"},
    {"type":"propId","value":"RU"},
    {"type":"propVal","value":"Japanese"},
    {"type":"propId","value":"SZ"},
    {"type":"propVal","value":"9"},
    {"type":"propId","value":"KM"},
    {"type":"propVal","value":"0.00"},
    {"type":"propId","value":"PW"},
    {"type":"propVal","value":"White"},
    {"type":"propId","value":"PB"},
    {"type":"propVal","value":"Black"},
    {"type":"terminal","value":";"},
    {"type":"propId","value":"B"},
    {"type":"propVal","value":"ee"},
    {"type":"terminal","value":";"},
    {"type":"propId","value":"W"},
    {"type":"propVal","value":"eg"},
    {"type":"terminal","value":";"},
    {"type":"propId","value":"B"},
    {"type":"propVal","value":"ec"},
    {"type":"terminal","value":"("},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"gf"},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"cf"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"gd"},
    {"type":"terminal","value":";"},{"type":"propId","value":"B"},
    {"type":"propVal","value":"dh"},{"type":"terminal","value":";"},
    {"type":"propId","value":"W"},{"type":"propVal","value":"gb"},
    {"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"fb"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"eh"},{"type":"terminal","value":"("},
    {"type":"terminal","value":";"},{"type":"propId","value":"B"},
    {"type":"propVal","value":"ei"},{"type":"terminal","value":";"},
    {"type":"propId","value":"W"},
    {"type":"propVal","value":"fi"},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"di"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"dg"},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"fh"},
    {"type":"terminal","value":")"},{"type":"terminal","value":"("},
    {"type":"terminal","value":";"},{"type":"propId","value":"B"},
    {"type":"propVal","value":"dg"},{"type":"terminal","value":";"},
    {"type":"propId","value":"W"},{"type":"propVal","value":"di"},
    {"type":"terminal","value":";"},{"type":"propId","value":"B"},
    {"type":"propVal","value":"ci"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"ei"},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"ch"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"ef"},{"type":"terminal","value":")"},
    {"type":"terminal","value":"("},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},
    {"type":"propVal","value":"gc"},{"type":"terminal","value":";"},
    {"type":"propId","value":"W"},
    {"type":"propVal","value":"hc"},{"type":"terminal","value":")"},
    {"type":"terminal","value":")"},{"type":"terminal","value":"("},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"eb"},{"type":"terminal","value":";"},
    {"type":"propId","value":"B"},{"type":"propVal","value":"fb"},
    {"type":"terminal","value":";"},{"type":"propId","value":"W"},
    {"type":"propVal","value":"db"},
    {"type":"terminal","value":";"},{"type":"propId","value":"B"},
    {"type":"propVal","value":"fd"},{"type":"terminal","value":";"},
    {"type":"propId","value":"W"},{"type":"propVal","value":"cd"},
    {"type":"terminal","value":")"},{"type":"terminal","value":")"}
  ];
  const nodes = [
    "(",
    {
        "id": 0,
        "props": {
            "GM": [
                1
            ],
            "FF": [
                4
            ],
            "CA": [
                "UTF-8"
            ],
            "AP": [
                [
                    "CGoban"
                ],
                [
                    "3"
                ]
            ],
            "ST": [
                2
            ],
            "RU": [
                "Japanese"
            ],
            "SZ": [
                [
                    9
                ]
            ],
            "KM": [
                0
            ],
            "PW": [
                "White"
            ],
            "PB": [
                "Black"
            ]
        }
    },
    {
        "id": 1,
        "props": {
            "B": [
                [
                    4,
                    4
                ]
            ]
        }
    },
    {
        "id": 2,
        "props": {
            "W": [
                [
                    4,
                    6
                ]
            ]
        }
    },
    {
        "id": 3,
        "props": {
            "B": [
                [
                    4,
                    2
                ]
            ]
        }
    },
    "(",
    {
        "id": 4,
        "props": {
            "W": [
                [
                    6,
                    5
                ]
            ]
        }
    },
    {
        "id": 5,
        "props": {
            "B": [
                [
                    2,
                    5
                ]
            ]
        }
    },
    {
        "id": 6,
        "props": {
            "W": [
                [
                    6,
                    3
                ]
            ]
        }
    },
    {
        "id": 7,
        "props": {
            "B": [
                [
                    3,
                    7
                ]
            ]
        }
    },
    {
        "id": 8,
        "props": {
            "W": [
                [
                    6,
                    1
                ]
            ]
        }
    },
    {
        "id": 9,
        "props": {
            "B": [
                [
                    5,
                    1
                ]
            ]
        }
    },
    {
        "id": 10,
        "props": {
            "W": [
                [
                    4,
                    7
                ]
            ]
        }
    },
    "(",
    {
        "id": 11,
        "props": {
            "B": [
                [
                    4,
                    8
                ]
            ]
        }
    },
    {
        "id": 12,
        "props": {
            "W": [
                [
                    5,
                    8
                ]
            ]
        }
    },
    {
        "id": 13,
        "props": {
            "B": [
                [
                    3,
                    8
                ]
            ]
        }
    },
    {
        "id": 14,
        "props": {
            "W": [
                [
                    3,
                    6
                ]
            ]
        }
    },
    {
        "id": 15,
        "props": {
            "B": [
                [
                    5,
                    7
                ]
            ]
        }
    },
    ")",
    "(",
    {
        "id": 16,
        "props": {
            "B": [
                [
                    3,
                    6
                ]
            ]
        }
    },
    {
        "id": 17,
        "props": {
            "W": [
                [
                    3,
                    8
                ]
            ]
        }
    },
    {
        "id": 18,
        "props": {
            "B": [
                [
                    2,
                    8
                ]
            ]
        }
    },
    {
        "id": 19,
        "props": {
            "W": [
                [
                    4,
                    8
                ]
            ]
        }
    },
    {
        "id": 20,
        "props": {
            "B": [
                [
                    2,
                    7
                ]
            ]
        }
    },
    {
        "id": 21,
        "props": {
            "W": [
                [
                    4,
                    5
                ]
            ]
        }
    },
    ")",
    "(",
    {
        "id": 22,
        "props": {
            "B": [
                [
                    6,
                    2
                ]
            ]
        }
    },
    {
        "id": 23,
        "props": {
            "W": [
                [
                    7,
                    2
                ]
            ]
        }
    },
    ")",
    ")",
    "(",
    {
        "id": 24,
        "props": {
            "W": [
                [
                    4,
                    1
                ]
            ]
        }
    },
    {
        "id": 25,
        "props": {
            "B": [
                [
                    5,
                    1
                ]
            ]
        }
    },
    {
        "id": 26,
        "props": {
            "W": [
                [
                    3,
                    1
                ]
            ]
        }
    },
    {
        "id": 27,
        "props": {
            "B": [
                [
                    5,
                    3
                ]
            ]
        }
    },
    {
        "id": 28,
        "props": {
            "W": [
                [
                    2,
                    3
                ]
            ]
        }
    },
    ")",
    ")"
]
  const tree = [
    {
      "id":0,"props":{
        "GM":[1],"FF":[4],"CA":["UTF-8"],"AP":[["CGoban"],["3"]],"ST":[2],"RU":["Japanese"],"SZ":[[9]],"KM":[0],"PW":["White"],"PB":["Black"]},
        "moveNumber":0,"parent":null,"children":[{"id":1,"props":{"B":[[4,4]]},"moveNumber":1,"parent":0,"children":[{"id":2,"props":{"W":[[4,6]]},"moveNumber":2,"parent":1,"children":[{"id":3,"props":{"B":[[4,2]]},"moveNumber":3,"parent":2,"children":[{"id":4,"props":{"W":[[6,5]]},"moveNumber":4,"parent":3,"children":[{"id":5,"props":{"B":[[2,5]]},"moveNumber":5,"parent":4,"children":[{"id":6,"props":{"W":[[6,3]]},"moveNumber":6,"parent":5,"children":[{"id":7,"props":{"B":[[3,7]]},"moveNumber":7,"parent":6,"children":[{"id":8,"props":{"W":[[6,1]]},"moveNumber":8,"parent":7,"children":[{"id":9,"props":{"B":[[5,1]]},"moveNumber":9,"parent":8,"children":[{"id":10,"props":{"W":[[4,7]]},"moveNumber":10,"parent":9,"children":[{"id":11,"props":{"B":[[4,8]]},"moveNumber":11,"parent":10,"children":[{"id":12,"props":{"W":[[5,8]]},"moveNumber":12,"parent":11,"children":[{"id":13,"props":{"B":[[3,8]]},"moveNumber":13,"parent":12,"children":[{"id":14,"props":{"W":[[3,6]]},"moveNumber":14,"parent":13,"children":[{"id":15,"props":{"B":[[5,7]]},"moveNumber":15,"parent":14,"children":[]}]}]}]}]},{"id":16,"props":{"B":[[3,6]]},"moveNumber":11,"parent":10,"children":[{"id":17,"props":{"W":[[3,8]]},"moveNumber":12,"parent":16,"children":[{"id":18,"props":{"B":[[2,8]]},"moveNumber":13,"parent":17,"children":[{"id":19,"props":{"W":[[4,8]]},"moveNumber":14,"parent":18,"children":[{"id":20,"props":{"B":[[2,7]]},"moveNumber":15,"parent":19,"children":[{"id":21,"props":{"W":[[4,5]]},"moveNumber":16,"parent":20,"children":[]}]}]}]}]}]},{"id":22,"props":{"B":[[6,2]]},"moveNumber":11,"parent":10,"children":[{"id":23,"props":{"W":[[7,2]]},"moveNumber":12,"parent":22,"children":[]}]}]}]}]}]}]}]}]},{"id":24,"props":{"W":[[4,1]]},"moveNumber":4,"parent":3,"children":[{"id":25,"props":{"B":[[5,1]]},"moveNumber":5,"parent":24,"children":[{"id":26,"props":{"W":[[3,1]]},"moveNumber":6,"parent":25,"children":[{"id":27,"props":{"B":[[5,3]]},"moveNumber":7,"parent":26,"children":[{"id":28,"props":{"W":[[2,3]]},"moveNumber":8,"parent":27,"children":[]}]}]}]}]}]}]}]}]}];

  test('tokenize', () => {
    expect(tokenize(sgf)).toEqual(tokens);
  });

  test('parseTokens', () => {
    expect(parseTokens(tokens)).toEqual(nodes);
  });

  test('buildGameObject', () => {
    expect(buildGameObject(nodes, false)).toEqual(tree);
  });

  test('buildGnodeTree', () => {
    const gnodeTree = buildGnodeTree(nodes);

    expect(gnodeTree[0].root.id).toEqual(0);
    expect(gnodeTree[0].terminal().id).toEqual(15);
  });
});