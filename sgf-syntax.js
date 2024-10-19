/**
 * @private
 * @param {string} sgf SGF string to parse
 * @returns {{
 * type: (
 * 'openParenthesis'|'closeParenthesis'|'semicolon'|'propVal'|'propId'|'whitespace'|'error'|'bracket'
 * );
 * value?: string;
 * depth?: number;
 * }[]} array of token objects
 */
function tokenize(sgf,callback) {
    let tokens = []; 

    let inpropId = false;
    let propIdContent = '';

    let bracketPos;
    let inBrackets = false;
    let escaped = false;
    let bracketContents = '';

    for (let i = 0; i < sgf.length; i++) {

        // handle square bracket contents (property value)
        if (inBrackets && escaped) {
            escaped = false;
            bracketContents += sgf[i];
        } else if (inBrackets && sgf[i] === '\\') {
            escaped = true;
            bracketContents += sgf[i];
        } else if (inBrackets && sgf[i] === ']') {
            inBrackets = false;
            tokens.push({
                type: 'propVal',
                value: bracketContents.slice(0)
            })
            tokens.push({
                type: 'bracket',
                value: ']'
            })
            bracketContents = '';
        } else if (inBrackets && i < sgf.length - 1) {
            bracketContents += sgf[i];
        } else if (inBrackets) {
            console.log(`missing ']' after [ at ${bracketPos}`
            )
            bracketContents += sgf[i];
            tokens.push({
                type: 'propVal',
                value: bracketContents.slice(0)
            })
        } else if (sgf[i] === '[') {
            bracketPos = i;
            inBrackets = true;
            tokens.push({
                type: 'bracket',
                value: '['
            })

        // handle property identifier
        } else if (/[A-Z]/.test(sgf[i])) {
            propIdContent += sgf[i];
            inpropId = true;
            if (!/[A-Z]/.test(sgf[i+1])) {
                if (sgf[i+1] === '[') {
                    inpropId = false;
                }
                tokens.push({
                    type: 'propId',
                    value: propIdContent.slice(0)
                })
                propIdContent = '';
            }
        } else if (inpropId) {
            console.log(`expecting propVal after propId '${tokens[tokens.length-1].value}'`)
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
    console.log(tokens);
    callback(tokens);
}

function syntax(tokens) {
    let html = '';
    for (let token of tokens) {
        html += `<span class='token ${token.type}'>${token.value}</span>`;
    }
    return html;
}

function HighlightSGF(sgf) {
    let text;
    tokenize(sgf, (result) => {
        text = syntax(result);
    });
    return text;
}

export default HighlightSGF;