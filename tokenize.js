function matchingSqBracket(string, position=0) {
    for (let i=position; i < string.length; i++) {
        if (string[i] === '\\') {
            i++;
        }
        else if (string[i] === ']') {
            return i;
        }
    }
    return -1;
}

function tokenize(sgf) {
    let tokens = [];
    let depth = 0;
    for (i=0; i < sgf.length; i++) {
        let token;
        let char = sgf[i];
        console.log(i,char);
        if (char === '(') {
            token = {
                tokenType: 'openGameTree',
                depth: depth
            }
            depth++;
        } else if (char === ')') {
            depth--;
            token = {
                tokenType: 'closeGameTree',
                depth: depth
            }
        } else if (char === ';') {
            token = {
                tokenType: 'newNode',
            }
        } else if (char === '[') {
            j = matchingSqBracket(sgf,i);
            token = {
                tokenType: 'propValue',
                value: sgf.slice(i+1,j)
            }
            i = j;
        } else if (/[A-Z]/.test(sgf[i])) {
            j = sgf.indexOf('[',i);
            token = {
                tokenType: 'propIdent',
                value: sgf.slice(i,j)
            }
            i = j-1;
        } else {
            console.log(`Char '${sgf[i]}' is not a valid SGF character`);
            continue;
        }
        tokens.push(token);
    }
    return tokens;
}

function nextNonPropValToken(tokens, position) {
    for (let i=position; i < tokens.length; i++) {
        if (tokens[i].tokenType !== 'propValue') {
            return i;
        }
    }
    return -1;
}

function groupPropertyParts(tokens) {
    let groupedTokens = [];
    for (let i=0; i < tokens.length; i++) {
        console.log('token:',tokens[i]);
        if (tokens[i].tokenType !== 'propIdent') {
            groupedTokens.push(tokens[i]);
            continue;
        } else {
            let j = nextNonPropValToken(tokens,i+1);
            let property = {
                tokenType: 'property',
                identifier: tokens[i].value,
                values: Array.from(tokens.slice(i+1,j), (x) => x.value)
            }
            i=j-1;
            groupedTokens.push(property);
        }
    }
    return groupedTokens;
}

function parseSGF(sgf) {
    let tokens = groupPropertyParts(tokenize(sgf));
    return tokens;
}

function tokenTest() {
    let sgfInput = document.querySelector(
        'textarea').value;
    let goGameObject = parseSGF(sgfInput);
    console.log(goGameObject);
}