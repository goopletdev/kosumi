const root = [
    'AP',
    'CA',
    'FF',
    'GM',
    'ST',
    'SZ'
]

const move = [
    'B',
    'BL',
    'BM',
    'DO',
    'IT',
    'KO',
    'MN',
    'OB',
    'OW',
    'TE',
    'W',
    'WL',
]

/**
 * @private
 * @param {string} sgf SGF string to parse
 * @returns {{
 * type: (
 * 'openParenthesis'|'closeParenthesis'|'semicolon'|'propVal'|'propId'|'whitespace'|'error'|'openBracket' | 'closeBracket'
 * );
 * value: string;
 * characteristic?: string;
 * }[]} array of token objects
 */
function tokenize(sgf,callback) {
    let tokens = []; 

    let inBrackets = false;
    let escaped = false;

    for (let i = 0; i < sgf.length; i++) {

        // handle square bracket contents (property value)
        if (inBrackets && escaped) {
            escaped = false;
            tokens.push({
                type: 'propVal',
                value: `\\${sgf[i]}`,
                characteristic: 'escaped'
            })
        } else if (inBrackets && sgf[i] === '\\') {
            escaped = true;
        } else if (inBrackets && sgf[i] === ']') {
            inBrackets = false;
            tokens.push({
                type: 'closeBracket',
                value: ']'
            })
        } else if (inBrackets && i < sgf.length - 1) {
            tokens.push({
                type: 'propVal',
                value: `${sgf[i]}`,
                characteristic: 'normal'
            })
        } else if (inBrackets) {
            tokens.push({
                type: 'propVal',
                value: sgf[i],
                characteristic: 'normal',
                error: 'missingClose'
            })
        } else if (sgf[i] === '[') {
            inBrackets = true;
            tokens.push({
                type: 'openBracket',
                value: '['
            })
        // handle property identifier
        } else if (/[A-Z]/.test(sgf[i])) {
            tokens.push({
                type: 'propId',
                value: sgf[i]
            })
        // non-bracket terminal symbols
        } else if ('();'.includes(sgf[i])) {
            let punctuationType;
            switch (sgf[i]) {
                case '(': 
                    punctuationType = 'openParenthesis';
                    break;
                case ')':
                    punctuationType = 'closeParenthesis';
                    break;
                case ';':
                    punctuationType = 'semicolon';
                    break;
            }
            tokens.push({
                type: punctuationType,
                value: sgf[i]
            })
        // whitespace
        } else if (' \n'.includes(sgf[i])){
            tokens.push({
                type: 'whitespace',
                value: sgf[i]
            })
        // erroneous character
        } else {
            tokens.push({
                type: 'error',
                value: sgf[i]
            })
        }
    }
    callback(tokens);
}

function getIdType(propId) {
    let type = 'generic';
    if (root.includes(propId)) {
        type = 'root';
    } else if (move.includes(propId)) {
        type = 'move';
    }
    return type;
}

/**
 * @private
 * @param {{
 * type: (
 * 'openParenthesis'|'closeParenthesis'|'semicolon'|'propVal'|'propId'|'whitespace'|'error'|'openBracket' | 'closeBracket'
 * );
 * value: string;
 * characteristic?: string;
 * }[]} tokens 
 * @param {function name(params)} callback 
 */
function parseTokens(tokens, callback) {
    let parsedTokens = [];
    let node = [];
    let propId = '';
    let propVal = [];

    let inNode = false;

    for (let i=0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token.type === 'closeBracket') {
            propVal.push(token);
            node.push({
                type: 'propVal',
                value: propVal.slice(0)
            });
            propVal = [];
        } else if (token.type === 'openBracket') {
            propVal.push(token);
        } else if (token.type === 'propVal') {
            propVal.push({
                type: token.characteristic,
                value: token.value
            });
        } else if (token.type === 'propId') {
            propId += token.value;
            if (tokens[i+1].type !== 'propId') {
                let idType = getIdType(propId);
                let propertyIdentifier = {
                    type: 'propId',
                    value: propId,
                    propIdType: idType
                }
                node.push(propertyIdentifier);
                propId = '';
            }
        } else if (token.type === 'semicolon') {
            inNode = true;
            if (node.length > 0) {
                parsedTokens.push({
                    type: 'node',
                    value: node.slice(0)
                });
            }
            node = [];
            node.push(token);
        } else if (token.type === 'openParenthesis') {
            if (node.length > 0) {
                parsedTokens.push({
                    type: 'node',
                    value: node.slice(0)
                });
                node = [];
            }
            inNode = false;
            parsedTokens.push(token);
        } else if (token.type === 'closeParenthesis') {
            if (node.length > 0) {
                parsedTokens.push({
                    type: 'node',
                    value: node.slice(0)
                });
                node = [];
            }
            inNode = false;
            parsedTokens.push(token);
        } else if (inNode) { //whitespace and error types
            node.push(token);
        } else {
            parsedTokens.push(token);
        }
    }
    callback(parsedTokens);
}

function syntax(tokens) {
    let html = '';
    for (let token of tokens) {
        if (['openParenthesis','closeParenthesis'].includes(token.type)) {
            html += `<span class='token ${token.type}'>${token.value}</span>`;
        } else if (token.type === 'node') {
            let nodeHtml = `<span class='token node'>`;
            for (let item of token.value) {
                if (item.type === 'semicolon') {
                    nodeHtml += `<span class='token semicolon'>;</span>`;
                } else if (item.type === 'propId') {
                    // add additional options for propId things;
                    nodeHtml += `<span class='token propId ${item.propIdType}'>${item.value}</span>`;
                } else if (item.type === 'propVal') {
                    // merge prop val tokens under prop id tokens
                    let propVal = `<span class='token propVal'>`;
                    for (let object of item.value) {
                        if (['openBracket','closeBracket'].includes(object.type)) {
                            propVal += `<span class='token ${object.type}'>${object.value}</span>`;
                        } else if (object.type === 'escaped') {
                            propVal += `<span class='token escaped'>${object.value}</span>`;
                        } else if (['normal','whitespace'].includes(object.type)) {
                            propVal += object.value;
                        } else {
                            propVal += `<span class='token ${object.type}'>${object.value}</span>`
                        }
                    }
                    propVal += `</span>`;
                    nodeHtml += propVal;
                } else if (['openBracket','closeBracket'].includes(item.type)) {
                    nodeHtml += `<span class='token ${item.type}'>${item.value}</span>`;
                } else if (item.type === 'whitespace') {
                    nodeHtml += item.value;
                } else {
                    nodeHtml += `<span class='token ${item.type}'>${item.value}</span>`;
                }
            }
            nodeHtml += `</span>`;
            html += nodeHtml;
        } else {
            html += `<span class='token ${token.type}'>${token.value}</span>`;
        }
    }
    return html;
}

function HighlightSGF(sgf) {
    let text;
    tokenize(sgf, (result) => {
        parseTokens(result, (result) => {
            text = syntax(result);
        })
    });
    return text;
}

export default HighlightSGF;