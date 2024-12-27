/**
 * 
 * @param {string} sgf 
 * @returns {{
 * type: string;
 * value?: string;
 * depth?: number;
 * nodeId?: number;
 * escaped?: boolean;
 * error?: string;
 * }[]}
 */
const tokenize = async (sgf) => {
    const tokens = [];

    // group propertyId and propertyValue characters together
    let value = '';
    let type;
    let depth = 0;
    let nodeId = -1;

    // escaped characters and bracket contents get their own token type
    let inBrackets = false;
    let escaped = false;

    /**
     * checks whether `value` has contents, 
     * pushes it to a token, sets `value` to empty string
     * @returns {boolean} true if token was pushed
     */
    const clearValue = () => {
        // checks whether value has contents, 
        // pushes it to a token, sets value = ''
        if (value) {
            tokens.push({ type, value });
            value = '';
            return true;
        }
        return false;
    }

    for (let i = 0; i < sgf.length; i++) {
        const character = sgf[i];
        // handle square bracket contents (property value)
        if (inBrackets) {
            type = 'propertyValue';
            if (escaped) {
                // create propertyValue token of just escaped character
                tokens.push({
                    type,
                    value: character,
                    escaped
                });
                escaped = false;
            } else if (character === '\\' && sgf[i+1] !== '\n') {
                clearValue();
                escaped = true;
            } else if (character === ']') {
                inBrackets = false;
                clearValue();
                tokens.push({ type: ']' });
            } else if (character === '\n') {
                clearValue();
                tokens.push({ type, value: '\n' });
            } else {
                value += character;
                if (i >= sgf.length - 1) {
                    tokens.push({
                        type, value, error: 'missingClose'
                    });
                    value = '';
                };
            }
        } else if (character === '[') {
            inBrackets = true;
            clearValue();
            tokens.push({ type: '[' });
        // handle property identifier 
        } else if (/[A-Z]/.test(character)) {
            type = 'propertyIdentifier';
            value += character;
        // non-bracket terminal symbols
        } else if (character === '(') {
            tokens.push({ type: '(', depth: ++depth });
        } else if (character === ')') {
            if (depth < 0) {
                tokens.push({
                    type: ')',
                    depth: depth--,
                    error: 'missingOpen'
                });
            } else tokens.push({ type: ')', depth: depth-- });
        } else if (character === ';') {
            tokens.push({ type: ';', nodeId: ++nodeId });
        } else if (character === '\n') {
            tokens.push({ type: 'newline', value: '\n' });
        } else if (' \t'.includes(character)) {
            tokens.push({ type: 'whitespace', value: character })
        // erroneous character
        } else {
            tokens.push({
                type: 'error',
                value: character,
                error: 'invalidCharacter'
            });
        }
    }
    return tokens;
}

module.exports = { tokenize }