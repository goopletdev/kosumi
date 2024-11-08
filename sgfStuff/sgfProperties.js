const gameName= [ //default = 1 'Go'
    null,
    'Go', 
    'Othello', 
    'chess',		
    'Gomoku+Renju', 
    "Nine Men's Morris",
    'Backgammon',
    'Chinese chess', 
    'Shogi', 
    'Lines of Action',
    'Ataxx', 
    'Hex', 
    'Jungle', 
    'Neutron',
    "Philosopher's Football", 
    'Quadrature', 
    'Trax',
    'Tantrix', 
    'Amazons', 
    'Octi', 
    'Gess',
    'Twixt', 
    'Zertz', 
    'Plateau', 
    'Yinsh',
    'Punct', 
    'Gobblet', 
    'hive', 
    'Exxit',
    'Hnefatal', 
    'Kuba', 
    'Tripples', 
    'Chase',
    'Tumbling Down', 
    'Sahara', 
    'Byte', 
    'Focus',
    'Dvonn', 
    'Tamsk', 
    'Gipf', 
    'Kropki'
]
const propertyDefinitions = {
    // root properties
    AP: {
        name: 'application',
        value: 'simpletext:simpletext',
        type: 'root',
        kosumiDefault: 'Kosumi:0.1.0',
        redBeanDefault: null,
    },
    CA: {
        name: 'charset',
        value: 'simpletext',
        type: 'root',
        kosumiDefault: 'UTF-8',
        redBeanDefault: 'ISO-8859-1',
    },
    FF: {
        name:'file format',
        value: 'number (range: 1-4)',
        type: 'root',
        kosumiDefault: 4,
        redBeanDefault: 1,
    },
    GM: {
        name: 'game',
        value: 'number (range: 1-16',
        type: 'root',
        kosumiDefault: 1,
        redBeanDefault: 1,
    }, 
    ST: { // I really don't understand this one
        name: 'variation style',
        value: 'number (range: 0-3)',
        type: 'root',
        kosumiDefault: 0,
        redBeanDefault: 0,
    },
    SZ: {
        name: 'board size',
        value: 'number | composed number ":" number',
        type: 'root',
        kosumiDefault: 19,
        redBeanDefault: 19,
    },
    // game info properties
    AN: {
        name: 'annotator',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    BR: {
        name: 'black rank',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    BT: {
        name: 'black team',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    CP: {
        name: 'copyright',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DT: {
        name: 'date played',
        value: 'simpletext (YYYY-MM-DD)',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    EV: {
        name: 'event name',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GN: {
        name: 'game name',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GC: {
        name: 'extra game info',
        value: 'text', // formatted text
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    ON: {
        name: 'opening',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OT: {
        name: 'overtime',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PB: {
        name: 'black player name',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PC: {
        name: 'game location',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PW: {
        name: 'white player name',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    RE: {
        name: 'result',
        value: 'simpletext (0/"Draw","B+"[score],"W+"[score], "B+R"/"B+Resign", "B+T"/"B+Time","B+F","B+Forfeit","Void" no result/suspended play, "?" unknown)',
        type: 'game-info',
        kosumiDefault: '?',
        redBeanDefault: null,
    },
    RO: {
        name: 'round number/round type',
        value: 'simpletext RO[xx (tt)] round number, type (final, playoff, league)',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    RU: {
        name: 'ruleset',
        value: 'simpletext ("AGA","GOE","Japanese","NZ")',
        type: 'game-info',
        kosumiDefault: 'AGA',
        redBeanDefault: null,
    },
    SO: {
        name: 'game record source',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TM: {
        name: 'time limits',
        value: 'real', // Number ["." Digit { Digit }]
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    US: {
        name: 'user who entered game',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WR: {
        name: 'white rank',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WT: {
        name: 'white team',
        value: 'simpletext',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // move properties
    B: {
        name: 'black move',
        value: 'move',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    KO: {
        name: 'execute illegal move',
        value: 'none',
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    MN: {
        name: 'set move number',
        value: 'number',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    W: {
        name: 'white move',
        value: 'move',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // setup props
    AB: {
        name: 'add black',
        value: 'list of stone',
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    AE: {
        name: 'add empty',
        value: 'list of point',
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    AW: {
        name: 'add white',
        value: 'list of stone',
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PL: {
        name: 'color to play',
        value: 'color',
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // node annotation props
    C: {
        name: 'comment',
        value: 'text',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DM: {
        name: 'position is even',
        value: 'double',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GB: {
        name: 'good for black',
        value: 'double',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GW: {
        name: 'good for white',
        value: 'double',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    HO: {
        name: 'hotspot',
        value: 'double',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    N: {
        name: 'node name',
        value: 'simpletext',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    UC: {
        name: 'position unclear',
        value: 'double',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    V: {
        name: 'node value',
        value: 'real', //positive: good for black; negative: good for white (estimated score)
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // move annotation props
    BM: {
        name: 'bad move',
        value: 'double',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DO: {
        name: 'doubtful move',
        value: 'none',
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    IT: {
        name: 'interesting move',
        value: 'none',
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    TE: {
        name: 'tesuji',
        value: 'double',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // time move props
    BL: {
        name: 'black time left',
        value: 'real',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OB: {
        name: 'black overtime',
        value: 'number',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OW: {
        name: 'white overtime',
        value: 'number',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WL: {
        name: 'white time left',
        value: 'real',
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // markup properties
    AR: {
        name: 'arrow',
        value: 'list of composed point ":" point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    CR: {
        name: 'circle',
        value: 'list of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DD: {
        name: 'dim/grey out',
        value: 'elist of point',
        type: 'inherit', // affects all subsequent node
        kosumiDefault: null,
        redBeanDefault: null,
    },
    LB: {
        name: 'text',
        value: 'list of composed point ":" simpletext',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    LN: {
        name: 'line',
        value: 'list of composed point ":" point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    MA: {
        name: 'mark with X',
        value: 'list of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    SL: {
        name: 'selected points', // 'type of markup unknown' - red-bean.com. ???? nani??
        value: 'list of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    SQ: {
        name: 'mark with square',
        value: 'list of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TR: {
        name: 'mark with triangle',
        value: 'list of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // miscellaneous properties
    FG: {
        name: 'figure',
        value: 'none | composition of number ":" simpletext',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PM: {
        name: 'move number printing style',
        value: 'number',
        type: 'inherit',
        kosumiDefault: 1,
        redBeanDefault: 1,
    },
    VW: {
        name: 'view part of board',
        value: 'elist of point',
        type: 'inherit',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // Go-specific 
    HA: {
        name: 'handicap',
        value: 'number',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    KM: {
        name: 'komi',
        value: 'real',
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TB: {
        name: 'black territory',
        value: 'elist of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TW: {
        name: 'white territory',
        value: 'elist of point',
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    }
}


const rootProperties = [
    'FF', // file format (1,3,4)
    'GM', // game (number, default 1)
    'AP', // application (Kosumi)
    'CA', // charset
    'ST', // variation style
    'SZ', // board size
]
const gameInfoProperties = [
    'GN', //name of the game (oft used within collection; could also be used as file-name)
    'SO', // source (book, journal)
    'US', //name of user who entered game
    'AN', // name of annotator
    'CP', // copyright info

    'PB', // name of black player
    'BR', // Black rank
    'BT', // Black team name (team matches)
    'PW', // name of White player
    'WR', // white player rank
    'WT', // white team name

    'EV', // name of event
    'PC', // place where game as played
    'DT', // date when game was played

    'RE', // result
    'RO', // round-number and type of round
    'RU', // rules
    'KM', // GOSPECIFIC defines komi

    'TM', // time limits of game (in seconds)
    'OT', // describes method of overtime

    'GC', // extra info about game; background info, or game summary
    'ON', // info about opening played


    'HA', // GOSPECIFIC num handicap stones

]
const moveProperties = [
    'MN',
    'B',
    'W',
    'KO',
]
const moveAnnotationProperties = [
    'BM',
    'DO',
    'IT',
    'TE',
]
const timingProperties = [
    'BL',
    'OB',
    'WL',
    'OW',
]
const setupProperties = [
    'AB',
    'AE',
    'AW',
    'PL',
]
const nodeAnnotationProperties = [
    'C',
    'DM',
    'GB',
    'GW',
    'HO',
    'N',
    'UC',
    'V',
]
const markupProperties = [
    'AR',
    'CR',
    'DD',
    'LB',
    'LN',
    'MA',
    'SL',
    'SQ',
    'TR',
]
const miscProperties = [
    'FG',
    'PM',
    'VW',
]

// utility values
const sgfPropOrder = [
    rootProperties,
    gameInfoProperties,
    moveProperties,
    moveAnnotationProperties,
    timingProperties,
    setupProperties,
    nodeAnnotationProperties,
    markupProperties,
    miscProperties
]

export {
    gameName,
    propertyDefinitions,
    rootProperties,
    gameInfoProperties,
    moveProperties,
    moveAnnotationProperties,
    timingProperties,
    setupProperties,
    nodeAnnotationProperties,
    markupProperties,
    miscProperties,
    sgfPropOrder,
}