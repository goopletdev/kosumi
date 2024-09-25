const gameRootProperties = {
    AP: 'application',
    CA: 'charset',
    FF: 'fileFormat', //default value: 1
    GM: 'gameType', //default value: 1
    ST: 'variationStyle', //default value: 0
    SZ: 'boardSize' //default value: 19 for Go, 8 for chess
}

const gameInfoProperties = {
    AN: 'annotatorName',
    BR: 'blackRank',
    BT: 'blackTeam',
    CP: 'copyright',
    DT: 'datePlayed',
    EV: 'eventName',
    GN: 'gameName',
    GC: 'extraInfo',
    ON: 'openingInfo',
    OT: 'overTimeInfo',
    PB: 'blackPlayerName',
    PC: 'locationPlayed',
    PW: 'whitePlayerName',
    RE: 'result',
    RO: 'roundNumberAndType',
    RU: 'ruleSet',
    SO: 'gameSource',
    TM: 'timeLimitSeconds',
    US: 'recorderName',
    WR: 'whiteRank',
    WT: 'whiteTeam'
}

const goInfoProperties = { // no default values
    HA: 'handicap',
    KM: 'komi'
}

const goOtherProperties = { // no default values
    TB: 'blackTerritory',
    TW: 'whiteTerritory'
}

function firstOpenSqBracket(string, index=0) {
    for (let i = index; i < string.length; i++) {
        if (string[i] === '[') return i
    }
    console.log(`Error: no '[' at or after index ${index}`)
}

function matchingSqBracket(string, index=0) {
    for (let i=index; i < string.length; i++) {
        if (string[i] === '\\') i++
        else if (string[i] === ']') return i
    }
    console.log(`Error: no matching ']' found for '[' at index ${index}`)
}

function firstOpenParen(string, index=0) {
    for (let i = index; i < string.length; i++) {
        if (string[i] === '[') i = matchingSqBracket(string, i)
        else if (string[i] === '(') return i
    }
    console.log(`Error: no '(' at or after index ${index}`)
}

function matchingParen(string, index=0) {
    if (string[index] !== '(') {
        console.log(`Error: ${string[index]} is not '('`)
        return null
    }
    let extraOpenParens = 0;
    for (let i=index + 1; i < string.length; i++) {
        if (string[i] === '[') i = matchingSqBracket(string, i)
        else if (string[i] === '(') extraOpenParens++
        else if (extraOpenParens && (string[i] === ')')) extraOpenParens--
        else if (string[i] === ')') return i
    }
    console.log(`Error: no matching ')' found for '(' at index ${index}`)
}

function firstSemicolon(string, index=0) {
    for (let i=index; i < string.length; i++) {
        if (string[i] === '[') i = matchingSqBracket(string, i)
        else if (string[i] === ';') return i
    }
    console.log(`Error: no ';' at or after index ${index}`)
}

function hasNodes(string, index=0) {
    for (let i=index; i < string.length; i++) {
        if (string[i] === '[') i = matchingSqBracket(string, i)
        else if (string[i] === ';') return true
    }
    return false
}

function firstGameTree(string, index=0) {
    let indexOpenParen = firstOpenParen(string, index)
    if (typeof indexOpenParen !== 'number') {
        console.log(`Error: no game tree after index ${index}`)
        return
    }
    let indexCloseParen = matchingParen(string, indexOpenParen)
    if (indexCloseParen) {
        let gameTree =  {
            indexOpen: indexOpenParen,
            indexClose: indexCloseParen,
            content: string.slice(indexOpenParen + 1, indexCloseParen)
        }
        console.log('gameTree:\n',gameTree)
        return gameTree
    }
    console.log(`Error: no game tree after index ${index}`)
}

function hasNestedGameTree(string, index=0) {
    let indexOpenParen = firstOpenParen(string, index)
    if (typeof indexOpenParen !== 'number') {
        return false
    }
    let indexCloseParen = matchingParen(string, indexOpenParen)
    if (typeof indexCloseParen === 'number') return true
    else return false
}

function formatNode(string, index=0) {
    console.log('in formatNode(), string, index:\n',string,index)
    let propertyIdentifier = ''
    let propertyValues = []
    let properties = []
    
    for (let i=index; i < string.length; i++) {
        let char = string[i]
        console.log('formatNode for loop; char=',char)
        if (char.match(/[A-Z]/) && (propertyValues.length===0)) {
            propertyIdentifier = propertyIdentifier.concat(char)
            console.log(`in formatNode(). string[i] = ${char}; matches /[A-Z]/\npropIdent=${propertyIdentifier}`)
        } else if (char === '[') {
            console.log('char="["')
            let indexAtClose = matchingSqBracket(string,i)
            let value = string.slice(i + 1, indexAtClose)
            propertyValues.push(value)
            console.log(`propertyValues=${propertyValues}`)
            i = indexAtClose
        } else if (propertyValues.length !== 0) {
            let property = [propertyIdentifier, propertyValues]
            console.log('char=',char,'property:\n',property)
            properties.push(property)
            propertyIdentifier = ''
            if (char.match(/[A-Z]/)) propertyIdentifier = char
            propertyValues = []
        }
    }
    properties.push([propertyIdentifier, propertyValues])

    let rootProperties = {}
    let infoProperties = {}
    let otherProperties = []

    console.log('properties:\n',properties)
    for (let property of properties) {
        let propIdent = property[0]
        let propVal = property[1]
        if (gameRootProperties.hasOwnProperty(propIdent)) {
            rootProperties[gameRootProperties[propIdent]]= propVal
        } else if (gameInfoProperties.hasOwnProperty(propIdent)) {
            infoProperties[gameInfoProperties[propIdent]]= propVal
        } else if (goInfoProperties.hasOwnProperty(propIdent)) {
            infoProperties[goInfoProperties[propIdent]]= propVal
        } else if (goOtherProperties.hasOwnProperty(propIdent)) {
            infoProperties[goOtherProperties[propIdent]]= propVal
        } else {
            otherProperties.push(property)
        }
    }
    let node = {}
    if (Object.keys(rootProperties).length) {
        node.rootProps = rootProperties
    }
    if (Object.keys(infoProperties).length) {
        node.infoProps = infoProperties
    }
    if (Object.keys(otherProperties).length) {
        node.otherProps = otherProperties
    }
    console.log('node:\n',node)
    return node
}

function getSequence(string, index=0) {
    // returns sequence as array of nodes
    console.log(`in getSequence(${string}, ${index})`)
    if (!hasNodes(string, index)) {
        console.log(`Error: no nodes after ${index}`)
        return null
    }
    let sequence = []
    let i = index
    while (hasNodes(string,i)) {
        console.log(`in getSequence still. string:\n${string}\ni:\n${i}`)
        i = firstSemicolon(string, i)
        console.log(`i=firstSemicolon(string,i)+1; i=${i}`)
        if (hasNodes(string,i)) {
            i++
            console.log(`in if statement; hasNodes is true`)
            let nextNode = firstSemicolon(string, i)
            let node = formatNode(string.slice(i,nextNode))
            sequence.push(node)
        } //else sequence.push(string.slice(i))
    }
    console.log('sequence:\n',sequence)
    return sequence
}

function getGameTree(string, index=0, isRoot=true) {
    let nestedGameTrees = []
    let i = index
    while (hasNestedGameTree(string, i)) {
        let nestedTree = firstGameTree(string, i)
        i = nestedTree.indexClose + 1
        nestedGameTrees.push(getGameTree(nestedTree.content,0,false))
    }
    let nodeSequence = string
    if (hasNestedGameTree(string, index)) {
        nodeSequence = string.slice(index, firstGameTree(string,index).indexOpen)
    }
    let sequence = getSequence(nodeSequence)

    let gameTree = {
        moves: []
    }

    for (node of sequence) {
        if (isRoot && node.hasOwnProperty('rootProps')) {
            if (!gameTree.hasOwnProperty('metaData')) gameTree.metaData = {}
            Object.assign(gameTree.metaData, node.rootProps) 
        }
        if (node.hasOwnProperty('infoProps')) {
            if (!gameTree.hasOwnProperty('gameInfo')) gameTree.gameInfo = {}
            Object.assign(gameTree.gameInfo, node.infoProps)
        }
        if (nestedGameTrees.length) {
            gameTree.gameTrees = nestedGameTrees
        }
        if (node.hasOwnProperty('otherProps')) {
            gameTree.moves = gameTree.moves.concat(node.otherProps)
        }
    }

    console.log('gameTree:\n',gameTree)
    return gameTree
}

function getCollection(string, index=0) {
    let gameList = []
    let gameTree = hasNestedGameTree(string)
    //checks if collection contains any game trees
    while (gameTree) {
        gameTree = firstGameTree(string, index)
        if (gameTree) {
            gameList.push(getGameTree(gameTree.content)) 
            index = gameTree.indexClose + 1
        }
    }
    console.log('gameList:\n',gameList)
    let collection = {}
    for (i = 0; i < gameList.length; i++) {
        collection[`game${i}`] = gameList[i]
    }
    return collection
}

function convert() {
    let sgfInput = document.querySelector('textarea').value
    console.log('sgfInput:\n',sgfInput)
    let collection = getCollection(sgfInput)
    console.log('game:\n',collection.game0)
}