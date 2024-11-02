const properties = { //propertyIdentifier: description,type,value
    B:['black','move','move'],
    BL:['blackTimeLeft','move','real'],
    BM:['badMove','move','double'],
    DO:['doubtful','move','none'],
    IT:['interesting','move','none'],
    KO:['ko','move','none'],
    MN:['setMoveNumber','move','number'],
    OB:['otStonesBlack','move','number'],
    OW:['otStonesWhite','move','number'],
    TE:['tesuji','move','double'],
    W:['white','move','move'],
    WL:['whiteTimeLeft','move','real'],

    AB:['addBlack','setup','list of stone'],
    AE:['addEmpty','setup','list of point'],
    AW:['addWhite','setup','list of stone'],
    PL:['playerToPlay','setup','color'],

    AR:['arrow','-',"list of composed point ':' point"], //new since ff3
    C:['comment','-','text'],
    CR:['circle','-','list of point'],
    DD:['dimPoints','- (inherit)','elist of point'], //new since ff3
    DM:['evenPosition','-','double'],
    FG:['figure','-','none | composed number ":" simpletext'], //changed from ff3
    GB:['goodForBlack','-','double'],
    GW:['goodForWhite','-','double'],
    HO:['hotspot','-','double'],
    LB:['label','-',"list of composed point ':' simpletext"], //changed from ff3
    LN:['line','-',"list of composed point ':' point"], //new since ff3
    MA:['mark','-','list of point'],
    N:['nodeName','-','simpletext'],
    PM:['printMoveMode','- (inherit)','number'], //new since ff3
    SL:['selected','-','list of point'],
    SQ:['square','-','list of point'], //new since ff3
    TR:['triangle','-','list of point'],
    UC:['unclearPos','-','double'],
    V:['value','-','real'],
    VW:['view','- (inherit)','elist of point'], //new since ff3

    AP:['application','root',"composed simpletext ':' number"], //new since ff3
    CA:['charset','root','simpletext'], //new since ff3 		Default value is 'ISO-8859-1' aka 'Latin1'.
    FF:['fileFormat','root','number (range: 1-4)'], // DEFAULT: 1
    GM:['game','root','number (range: 1-5,7-17)'], //DEFAULT: 1;
    ST:['style','root','number (range: 0-3)'], //new since ff3 DEFAULT: 0;
    SZ:['size','root',"(number | composed number ':' number)"],  //changed from ff3 DEFAULT: for go 19; for chess 8

    AN:['annotation','game-info','simpletext'],
    BR:['blackRank','game-info','simpletext'],
    BT:['blackTeam','game-info','simpletext'],
    CP:['copyright','game-info','simpletext'],
    DT:['date','game-info','simpletext'],  //changed from ff3
    EV:['event','game-info','simpletext'],
    GC:['gameComment','game-info','text'],
    GN:['gameName','game-info','simpletext'],
    ON:['opening','game-info','simpletext'],
    OT:['overtime','game-info','simpletext'], //new since ff3
    PB:['playerBlack','game-info','simpletext'],
    PC:['place','game-info','simpletext'],
    PW:['playerWhite','game-info','simpletext'],
    RE:['result','game-info','simpletext'],  //changed from ff3
    RO:['round','game-info','simpletext'],
    RU:['rules','game-info','simpletext'],  //changed from ff3
    SO:['source','game-info','simpletext'],
    TM:['timeLimit','game-info','real'],
    US:['user','game-info','simpletext'],
    WR:['whiteRank','game-info','simpletext'],
    WT:['whiteTeam','game-info','simpletext'],
}

const gameSpecificProperties = [
    null, //0
    {
        TB:['Territory Black','-','elist of point'],
        TW:['Territory White','-','elist of point'],
        HA:['Handicap','game-info','number'],
        KM:['Komi','game-info','real']
    }, //1 go
    null,
    null,
    null,
    null,
    {}, //6 backgammon
    null,
    null,
    {}, //9 lines of Action
    null,
    {} //11 Hex
]
const propertyST = [ //default = 0
    ['children',true],
    ['siblings',true],
    ['children',false],
    ['siblings',false]
]
const propertyGM = [ //default = 1 'Go'
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

let gameProps = {...properties, ...gameSpecificProperties[1]};



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
const sgfCoordinates = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
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
const zipableProps = [
    'AB',
    'AE',
    'AW',
    'CR',
    'DD',
    'MA',
    'SL',
    'SQ',
    'TR',
    'VW',
]

export {
    rootProperties,
    gameInfoProperties,
    moveProperties,
    moveAnnotationProperties,
    timingProperties,
    setupProperties,
    nodeAnnotationProperties,
    markupProperties,
    miscProperties,
    sgfCoordinates,
    sgfPropOrder,
    zipableProps,
}