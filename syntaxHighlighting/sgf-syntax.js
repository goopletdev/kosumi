/**
 * @module sgf-syntax
 */

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
                characteristic: 'escapedCharacter'
            })
        } else if (inBrackets && sgf[i] === '\\' && sgf[i+1] !== '\n') {
            // not sure about that last check for sgf[i+1]; should 
            // get opinions
            escaped = true;
        } else if (inBrackets && sgf[i] === ']') {
            inBrackets = false;
            tokens.push({
                type: 'closeBracket',
                value: ']'
            })
        } else if (inBrackets && sgf[i] === '\n') {
            tokens.push({
                type: 'newline',
                value: sgf[i],
            })
        } else if (inBrackets && i < sgf.length - 1) {
            tokens.push({
                type: 'propertyValue',
                value: `${sgf[i]}`,
                characteristic: 'normalCharacter'
            })
        } else if (inBrackets) {
            tokens.push({
                type: 'propertyValue',
                value: sgf[i],
                characteristic: 'normalCharacter',
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
                type: 'propertyIdentifier',
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
        } else if (sgf[i] === '\n') {
            tokens.push({
                type: 'newline',
                value: sgf[i]
            })
        } else if (' \t'.includes(sgf[i])){
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

/**
 * @private
 * @param {
 * {
 * type: (
 * 'openParenthesis'|'closeParenthesis'|'semicolon'|'propVal'|'propId'|'whitespace'|'error'|'openBracket' | 'closeBracket'
 * );
 * value: string;
 * characteristic?: string;
 * }[]
 * } tokens 
 * @returns {HTMLElement[]} 
 */
function syntaxHTML(tokens) {
    let html = [];
    let line = '';
    tokens.forEach((token,i) => {
        if (token.type === "propertyValue") {
            line += `<span class="token propertyValue ${token.characteristic}">${token.value}</span>`;
        } else if (token.type === 'closeBracket') {
            line += `<span class="token closeBracket">]</span>`;
        } else if (token.type === 'newline') {
            html.push(line);
            line = '';
        } else if (token.type === 'openBracket') {
            line += `<span class="token openBracket">[</span>`;
        } else if (token.type === 'propertyIdentifier') {
            line += `<span class="token propertyIdentifier">${token.value}</span>`;
        } else if (token.type === 'whitespace') {
            line += `<span class="token whitespace">${token.value}</span>`;
        } else if (token.type === 'error') {
            line += `<span class="token error">${token.value}</span>`;
        } else {
            line += `<span class="token ${token.type}">${token.value}</span>`;
        }
    })
    html.push(line);
    return html;
}

/**
 * Provides syntax highlighting on sgf, split at linebreaks into array
 * @param {string} sgf sgf text
 * @returns {HTMLElement[]} spans with classes for coloring
 */
function HighlightSGF(sgf) {
    let text;
    tokenize(sgf, (result) => {
        text = syntaxHTML(result);
    });
    return text;
}

export default HighlightSGF;