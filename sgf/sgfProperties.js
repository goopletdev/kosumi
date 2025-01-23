import { numCoord } from "./sgfUtils.js";

/**
 * Returns a parsed number if it is in the expected range, or throws and error
 * @param {string} propIdent 
 * @param {string} propVal 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} Property value parsed to integer
 */
const range = (propVal, propIdent, min, max) => {
    const val = parseInt(propVal);
    if (val <= max && val >= min) return val;
    const errorMessage = `${propIdent}[${propVal}] is not allowed`;
    if (val !== val) throw new TypeError(errorMessage);
    throw new RangeError(errorMessage);
}

/**
 * Tries parsing property value to integer
 * @param {string} propVal 
 * @param {string} propIdent 
 * @returns {number} Property value parsed to integer
 */
const number = (propVal, propIdent) => {
    // currently expectInt and expectFloat will allow for erroneous characters;
    // this should still throw an error. add error handling for this later
    const val = parseInt(propVal);
    if (val===val) return val;
    throw new TypeError(`${propIdent}[${propVal}] is not allowed`);
}

/**
 * Tries parsing property value to float
 * @param {string} propVal 
 * @param {string} propIdent 
 * @returns {number} Property value parsed to float
 */
const real = (propVal, propIdent) => {
    const val = parseFloat(propVal);
    if (val===val) return val;
    throw new TypeError(`${propIdent}[${propVal}] is not allowed`);
}

/**
 * Replaces non-linebreak whitespace with ' ' and restores escaped colons
 * @param {string} propVal 
 * @returns {string} Correctly-formatted SGF text
 */
const text = (propVal) => {
    return propVal.replaceAll('<ESCAPEDCOLON>',':')
        .replaceAll('\r','\n')
        .replaceAll(new RegExp(/[\t\f\v]/, 'g'),' ');
}

/**
 * Replaces whitespace (including linebreaks) with ' ' 
 * @param {string} propVal 
 * @returns {string} Correctly-formatted SGF simpletext
 */
const simpleText = (propVal) => text(propVal).replaceAll('\n',' ');

/**
 * Returns a parsed 'double', which is a 1 or a 2
 * @param {string} propVal 
 * @param {string} propIdent 
 * @returns {number} Integer
 */
const double = (propVal, propIdent) => {
    if (/[12]/.test(propVal) && propVal.length === 1) return parseInt(propVal);
    throw new Error(`${propIdent}[${propVal}] is not allowed`);
}

/**
 * Checks whether property value is empty
 * @param {''} propVal Empty string
 * @param {string} propIdent uppercase SGF property identifier
 * @returns {[]} Empty array
 * @throws {Error} if propVal is not an empty string
 */
const none = (propVal, propIdent) => {
    if (propVal) throw new Error(`${propIdent}[${propVal}] is not allowed`);
    return [];
}

/**
 * Checks whether move is allowed by SGF specifications, parses to num array
 * @param {string} propVal SGF coordinate
 * @param {string} propIdent uppercase SGF property identifier
 * @returns {[number,number]} SGF move coordinate parsed to numeric coordinates
 */
const move = (propVal, propIdent) => {
    // currently this requires 2 dimensions exactly
    // this should be updated to check for compatibility with board dimensions
    // this also only allows only one move per turn, 
    // and doesn't allow empty propvals for passing
    if (/[A-Za-z]/.test(propVal) && propVal.length === 2) {
        return numCoord(propVal);
    }
    throw new Error(`${propIdent}[${propVal}] is not allowed`);
}

/**
 * Parses compressed and regular SGF coordinates into numeric coordinates
 * @param {string} propVal SGF coordinate or compressed coordinate e.g. wx:yz
 * @param {string} propIdent uppercase SGF property identifier
 * @returns {Array.<[number,number]>} 2d array of numeric coordinates
 */
const point = (propVal, propIdent) => {
    const coords =  propVal.split(':').map(val => move(val,propIdent));
    if (coords.length === 1) return [coords];
    let unzipped = [];

    for (let x = coords[0][0]; x <= coords[1][0]; x++) {
        for (let y = coords[0][1]; y <= coords[1][1]; y++) {
            unzipped.push([x,y]);
        }
    }

    return unzipped;
}

/**
 * Checks whether string is an allowed SGF color property
 * @param {'B' | 'W'} propVal SGF color name
 * @param {string} propIdent uppercase SGF property identifier
 * @returns {'B' | 'W'} SGF color name
 * @throws Will throw an error if called with a disallowed color name
 */
const color = (propVal, propIdent) => {
    // consider adding support for other colors like URG (blue red green)
    if (/[BW]/.test(propVal) && propVal.length === 1) return propVal;
    throw new Error(`${propIdent}[${propVal}] is not allowed`);
}

/**
 * Splits a composed value into an array, and runs the corresponding function
 * on each item. If there are fewer functions than items, it will call the 
 * last function on each remaining item. 
 * @param {string} propVal Composed value < value ':' value >
 * @param {string} propIdent uppercase SGF property identifier
 * @param  {...function} funcs Callback functions
 * @returns {Array.<any>} Parsed SGF property values
 * @throws {RangeError} if the split value has fewer items than funcs
 */
const composed = (propVal, propIdent, ...funcs) => {
    const vals = propVal.split(':');
    if (vals.length < funcs.length) throw new RangeError(`${propIdent}[${propVal}] is not allowed`);
    return vals.map((val,index) => {
        const func = funcs?.[index] ? funcs[index] : funcs[-1];
        return func(val, propIdent);
    }) 
}

/**
 * Like point() but allows for an empty property value
 * @param {'' | string} propVal Empty string or zipped/unzipped SGF coords
 * @param {string} propIdent uppercase SGF property identifier
 * @returns {[] | Array.<[number,number]>} Array of parsed SGF coord/coords
 * or empty array
 */
const eList = (propVal, propIdent) => {
    // always eList of point
    return propVal ? point(propVal,propIdent) : [propVal];
}

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
        value: 'composed simpletext:simpletext',
        parse: (propVal) => propVal.split(':').map(val => simpleText(val)),
        type: 'root',
        kosumiDefault: 'Kosumi:0.1.0',
        redBeanDefault: null,
    },
    CA: {
        name: 'charset',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'root',
        kosumiDefault: 'UTF-8',
        redBeanDefault: 'ISO-8859-1',
    },
    FF: {
        name:'file format',
        value: 'number (range: 1-4)',
        parse: (propVal) => [range(propVal,'FF',1,4)],
        type: 'root',
        kosumiDefault: 4,
        redBeanDefault: 1,
    },
    GM: {
        name: 'game',
        value: 'number (range: 1-16)[sic]',
        parse: (propVal) => [range(propVal,'GM',1,1)],
        type: 'root',
        kosumiDefault: 1,
        redBeanDefault: 1,
    }, 
    ST: { // I really don't understand this one
        name: 'variation style',
        value: 'number (range: 0-3)',
        parse: (propVal) => [range(propVal,'ST',0,3)],
        type: 'root',
        kosumiDefault: 0,
        redBeanDefault: 0,
    },
    SZ: {
        name: 'board size',
        value: 'number | composed number ":" number',
        parse:(propVal) => propVal.split(':').map(num => number(num,'SZ')),
        type: 'root',
        kosumiDefault: 19,
        redBeanDefault: 19,
    },
    // game info properties
    AN: {
        name: 'annotator',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    BR: {
        name: 'black rank',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    BT: {
        name: 'black team',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    CP: {
        name: 'copyright',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DT: {
        name: 'date played',
        value: 'simpletext (YYYY-MM-DD)',
        parse: (propVal) => {
            // this is way more complicated than i thought.
            // check red-bean for specifications and shortcuts, implement eventually
            return [simpleText(propVal)];
        },
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    EV: {
        name: 'event name',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GN: {
        name: 'game name',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GC: {
        name: 'extra game info',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    ON: {
        name: 'opening',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OT: {
        name: 'overtime',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PB: {
        name: 'black player name',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PC: {
        name: 'game location',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PW: {
        name: 'white player name',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    RE: {
        name: 'result',
        value: 'simpletext (0/"Draw","B+"[score],"W+"[score], "B+R"/"B+Resign", "B+T"/"B+Time","B+F","B+Forfeit","Void" no result/suspended play, "?" unknown)',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: '?',
        redBeanDefault: null,
    },
    RO: {
        name: 'round number/round type',
        value: 'simpletext RO[xx (tt)] round number, type (final, playoff, league)',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    RU: {
        name: 'ruleset',
        value: 'simpletext ("AGA","GOE","Japanese","NZ")',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: 'AGA',
        redBeanDefault: null,
    },
    SO: {
        name: 'game record source',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TM: {
        name: 'time limits',
        value: 'real', // Number ["." Digit { Digit }]
        parse: (propVal) => [real(propVal,'TM')],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    US: {
        name: 'user who entered game',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WR: {
        name: 'white rank',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WT: {
        name: 'white team',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // move properties
    B: {
        name: 'black move',
        value: 'move',
        parse: (propVal) => [move(propVal,'B')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    KO: {
        name: 'execute illegal move',
        value: 'none',
        parse: (propVal) => none(propVal,'KO'),
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    MN: {
        name: 'set move number',
        value: 'number',
        parse: (propVal) => [number(propVal,'MN')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    W: {
        name: 'white move',
        value: 'move',
        parse: (propVal) => [move(propVal,'W')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // setup props
    AB: {
        name: 'add black',
        value: 'list of stone',
        parse: (propVal) => point(propVal,'AB'),
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    AE: {
        name: 'add empty',
        value: 'list of point',
        parse: (propVal) => point(propVal,'AE'),
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    AW: {
        name: 'add white',
        value: 'list of stone',
        parse: (propVal) => point(propVal,'AW'),
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PL: {
        name: 'color to play',
        value: 'color',
        parse: (propVal) => [color(propVal,'PL')],
        type: 'setup',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // node annotation props
    C: {
        name: 'comment',
        value: 'text',
        parse: (propVal) => [text(propVal)],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DM: {
        name: 'position is even',
        value: 'double',
        parse: (propVal) => [double(propVal,'DM')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GB: {
        name: 'good for black',
        value: 'double',
        parse: (propVal) => [double(propVal,'GB')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    GW: {
        name: 'good for white',
        value: 'double',
        parse: (propVal) => [double(propVal,'GW')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    HO: {
        name: 'hotspot',
        value: 'double',
        parse: (propVal) => [double(propVal,'HO')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    N: {
        name: 'node name',
        value: 'simpletext',
        parse: (propVal) => [simpleText(propVal)],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    UC: {
        name: 'position unclear',
        value: 'double',
        parse: (propVal) => [double(propVal,'UC')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    V: {
        name: 'node value',
        value: 'real', //positive: good for black; negative: good for white (estimated score)
        parse: (propVal) => [real(propVal,'V')],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // move annotation props
    BM: {
        name: 'bad move',
        value: 'double',
        parse: (propVal) => [double(propVal,'BM')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DO: {
        name: 'doubtful move',
        value: 'none',
        parse: (propVal) => none(propVal,'DO'),
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    IT: {
        name: 'interesting move',
        value: 'none',
        parse: (propVal) => none(propVal,'IT'),
        type: 'move',
        kosumiDefault: '',
        redBeanDefault: null,
    },
    TE: {
        name: 'tesuji',
        value: 'double',
        parse: (propVal) => [double(propVal,'TE')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // time move props
    BL: {
        name: 'black time left',
        value: 'real',
        parse: (propVal) => [real(propVal,'BL')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OB: {
        name: 'black overtime',
        value: 'number',
        parse: (propVal) => [number(propVal,'OB')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    OW: {
        name: 'white overtime',
        value: 'number',
        parse: (propVal) => [number(propVal,'OW')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    WL: {
        name: 'white time left',
        value: 'real',
        parse: (propVal) => [real(propVal,'WL')],
        type: 'move',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // markup properties
    AR: {
        name: 'arrow',
        value: 'list of composed point ":" point',
        parse: (propVal) => composed(propVal,'AR',point,point),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    CR: {
        name: 'circle',
        value: 'list of point',
        parse: (propVal) => point(propVal,'CR'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    DD: {
        name: 'dim/grey out',
        value: 'elist of point',
        parse: (propVal) => eList(propVal,'DD'),
        type: 'inherit', // affects all subsequent node
        kosumiDefault: null,
        redBeanDefault: null,
    },
    LB: {
        name: 'text',
        value: 'list of composed point ":" simpletext',
        parse: (propVal) => composed(propVal,'LB',point,simpleText),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    LN: {
        name: 'line',
        value: 'list of composed point ":" point',
        parse: (propVal) => composed(propVal,'LN',point,point),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    MA: {
        name: 'mark with X',
        value: 'list of point',
        parse: (propVal) => point(propVal,'MA'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    SL: {
        name: 'selected points', // 'type of markup unknown' - red-bean.com. ???? nani??
        value: 'list of point',
        parse: (propVal) => point(propVal,'SL'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    SQ: {
        name: 'mark with square',
        value: 'list of point',
        parse: (propVal) => point(propVal,'SQ'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TR: {
        name: 'mark with triangle',
        value: 'list of point',
        parse: (propVal) => point(propVal,'TR'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // miscellaneous properties
    FG: {
        name: 'figure',
        value: 'none | composition of number ":" simpletext',
        parse: (propVal) => propVal ? composed(propVal,'FG',number,simpleText) : [propVal],
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    PM: {
        name: 'move number printing style',
        value: 'number',
        parse: (propVal) => [number(propVal,'PM')],
        type: 'inherit',
        kosumiDefault: 1,
        redBeanDefault: 1,
    },
    VW: {
        name: 'view part of board',
        value: 'elist of point',
        parse: (propVal) => eList(propVal,'VW'),
        type: 'inherit',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    // Go-specific 
    HA: {
        name: 'handicap',
        value: 'number',
        parse: (propVal) => [number(propVal,'HA')],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    KM: {
        name: 'komi',
        value: 'real',
        parse: (propVal) => [real(propVal,'KM')],
        type: 'game-info',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TB: {
        name: 'black territory',
        value: 'elist of point',
        parse: (propVal) => eList(propVal,'TB'),
        type: '-',
        kosumiDefault: null,
        redBeanDefault: null,
    },
    TW: {
        name: 'white territory',
        value: 'elist of point',
        parse: (propVal) => eList(propVal,'TW'),
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