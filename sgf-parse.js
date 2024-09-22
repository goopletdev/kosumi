function firstOpenParenthesis(string, index=0) {
    for (let i = index; i < string.length; i++) {
        if (string[i] === '[') i = matchingSquareBracket(string, i)
        else if (string[i] === '(') return i
    }
    console.log(`Error: no '(' at or after index ${index}`)
}

function firstOpenSquareBracket(string, index=0) {
    for (let i = index; i < string.length; i++) {
        if (string[i] === '[') return i
    }
    console.log(`Error: no '[' at or after index ${index}`)
}

function matchingSquareBracket(string, index=0) {
    for (let i=index; i < string.length; i++) {
        if (string[i] === '\\') i++
        else if (string[i] === ']') return i
    }
    console.log(`Error: no matching ']' found for '[' at index ${index}`)
}

function matchingParenthesis(string, index=0) {
    if (string[index] !== '(') {
        console.log(`Error: ${string[index]} is not '('`)
        return null
    }
    let extraOpenParens = 0;
    for (let i=index + 1; i < string.length; i++) {
        if (string[i] === '[') i = matchingSquareBracket(string, i)
        else if (string[i] === '(') extraOpenParens++
        else if (extraOpenParens && (string[i] === ')')) extraOpenParens--
        else if (string[i] === ')') return i
    }
    console.log(`Error: no matching ')' found for '(' at index ${index}`)
}

function firstSemicolon(string, index=0) {
    for (let i=index; i < string.length; i++) {
        if (string[i] === '[') i = matchingSquareBracket(string, i)
        else if (string[i] === ';') return i
    }
    console.log(`Error: no ';' at or after index ${index}`)
}

