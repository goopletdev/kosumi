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