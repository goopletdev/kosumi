function findNextOpenBracket(string, index=0) {
    for (let i = index; i < string.length; i++) {
        if (string[i] === '\\') {
            i++;
            continue;
        } else if ('[{(<'.includes(string[i])) {
            return i;
        };
    };
    return null;
}
function findClosingBracket(string, index = 0) {
    let openBracket = string[index];
    let closeBracket;
    switch (openBracket) {
        case '[':
            closeBracket = ']';
            break;
        case '(':
            closeBracket = ')';
            break;
        case '{':
            closeBracket = '}';
            break;
        case '<':
            closeBracket = '>';
            break;
        default:
            console.log(`Error: ${openBracket} is not a valid opening bracket.`);
            return null;
    };
    let inSquareBrackets = false;
    if (openBracket = '[') {
        inSquareBrackets = true;
    }
    let additionalOpenBrackets = 0;
    let indexAtClosingBracket;
    for (let i = index + 1; i < string.length; i++) {
        char = string[i];
        if (char === openBracket) {
            if (inSquareBrackets) {
                continue;
            } else {
                additionalOpenBrackets++;
                continue;
            };
        } else if (char === '\\') {
            i++;
            continue;
        } else if (char !== closeBracket) {
            if (inSquareBrackets && (char === ']')) {
                inSquareBrackets = false;
            } else if (!inSquareBrackets && char === '[') {
                inSquareBrackets = true;
            };
            continue;
        } else if (additionalOpenBrackets) {
            additionalOpenBrackets--;
            continue;
        } else {
            indexAtClosingBracket = i;
            break;
        };
    };
    if (!indexAtClosingBracket) {
        console.log(`Error: ${openBracket} has no matching bracket.`);
        return null;
    };
    let contents = string.slice(index + 1, indexAtClosingBracket);
    console.log(`Matching ${closeBracket} for ${openBracket} at ${index} found at ${indexAtClosingBracket}. Contents: ${contents}`);
    return contents;
}