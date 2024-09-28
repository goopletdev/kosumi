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
    CA:['charset','root','simpletext'], //new since ff3
    FF:['fileFormat','root','number (range: 1-4)'],
    GM:['game','root','number (range: 1-5,7-17)'],
    ST:['style','root','number (range: 0-3)'], //new since ff3
    SZ:['size','root',"(number | composed number ':' number)"],  //changed from ff3

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

let gameProperties = properties;

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