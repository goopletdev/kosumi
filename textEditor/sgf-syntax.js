/**
 * @module sgf-syntax
 */

import * as lazy from '../lazy-dom.js';

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
    const tokens = []; 

    let inBrackets = false;
    let escaped = false;

    for (let i = 0; i < sgf.length; i++) {

        // handle square bracket contents (property value)
        let char = sgf[i];
        if (inBrackets) {
            if (escaped) {
                escaped = false;
                tokens.push({
                    type: 'propVal',
                    value: `\\${char}`,
                    characteristic: 'escapedCharacter'
                })
            } else if (char === '\\') {
                escaped = true;
            } else if (char === ']') {
                inBrackets = false;
            }
        }
        if (inBrackets && escaped) {

        } else if (inBrackets && char === '\\' && sgf[i+1] !== '\n') {
            // not sure about that last check for sgf[i+1]; should 
            // get opinions
            escaped = true;
        } else if (inBrackets && char === ']') {
            inBrackets = false;
            tokens.push({
                type: 'closeBracket',
                value: ']'
            })
        } else if (inBrackets && char === '\n') {
            tokens.push({
                type: 'newline',
                value: char,
            })
        } else if (inBrackets && i < sgf.length - 1) {
            tokens.push({
                type: 'propertyValue',
                value: `${char}`,
                characteristic: 'normalCharacter'
            })
        } else if (inBrackets) {
            tokens.push({
                type: 'propertyValue',
                value: char,
                characteristic: 'normalCharacter',
                error: 'missingClose'
            })
        } else if (char === '[') {
            inBrackets = true;
            tokens.push({
                type: 'openBracket',
                value: '['
            })
        // handle property identifier
        } else if (/[A-Z]/.test(char)) {
            tokens.push({
                type: 'propertyIdentifier',
                value: char
            })
        // non-bracket terminal symbols
        } else if ('();'.includes(char)) {
            let punctuationType;
            switch (char) {
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
                value: char
            })
        // whitespace
        } else if (char === '\n') {
            tokens.push({
                type: 'newline',
                value: char
            })
        } else if (' \t'.includes(char)){
            tokens.push({
                type: 'whitespace',
                value: char
            })
        // erroneous character
        } else {
            tokens.push({
                type: 'error',
                value: char
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
    let nodes = [];
    let line = document.createElement('div');
    line.classList.add('line');
    tokens.forEach((token,i) => {
        if (token.type === 'newline') {
            nodes.push(line);
            line = document.createElement('div');
            line.classList.add('line');
            return;
        }
        let subLine;
        if (line.lastChild) {
            if (line.lastChild.classList.value.includes(token.type)) {
                if (token.type !== 'propertyValue') {
                    line.lastChild.textContent += token.value;
                } else if (line.lastChild.classList.value.includes('normalCharacter')) {
                    if (token.characteristic === 'normalCharacter') {
                        line.lastChild.textContent+= token.value;
                    } else {
                        subLine = document.createElement('span');
                        subLine.classList.add('token','propertyValue',token.characteristic);
                        subLine.textContent = token.value;
                        line.lastChild.appendChild(subLine);
                    }
                } else {
                    if (token.characteristic === 'normalCharacter') {
                        subLine = document.createElement('span');
                        subLine.classList.add('token', 'propertyValue', token.characteristic);
                        subLine.textContent = token.value;
                        line.appendChild(subLine);
                    }
                }
                return;
            }
        }

        subLine = document.createElement('span');

        if (token.type === "propertyValue") {
            subLine.classList.add('token', 'propertyValue', token.characteristic);
            subLine.textContent = token.value;
        } else {
            subLine.classList.add('token', token.type);
            subLine.textContent = token.value;
        }
        line.appendChild(subLine);
    })
    nodes.push(line);
    return nodes;
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