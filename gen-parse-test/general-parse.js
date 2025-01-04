/**
 * Tokenizes SGF, maintaining all characters, 
 * including whitespace,newlines, and invalid characters, 
 * but grouping all related characters 
 * to prepare them for syntax highlighting.
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

    // group consecutive characters together that share a type
    let value = '';
    let type;
    let depth = 0;
    let nodeId = -1;

    // escaped characters and bracket contents get their own token
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
        // loop through each individual character
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
            } else if (character === '\\' && sgf?.[i+1] !== '\n') {
                clearValue();
                escaped = true;
            } else if (character === ']') {
                inBrackets = false;
                clearValue();
                tokens.push({ type: ']' });
            } else if (character === '\n') {
                clearValue();
                tokens.push({ type, value: '\n' })
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
        } else if (/[A-Z]/.test(character)) {
            // a property identifier is a string of
            // one or more uppercase letters
            type = 'propertyIdentifier';
            value += character;
        } else if (character === '(') {
            // '(' indicates a new game tree
            clearValue();
            tokens.push({ type: '(', depth: ++depth });
        } else if (character === ')') {
            // ')' closes a game tree
            clearValue();
            if (depth < 0) {
                tokens.push({
                    type: ')',
                    depth: depth--,
                    error: 'missingOpen'
                });
            } else tokens.push({ type: ')', depth: depth-- });
        } else if (character === ';') {
            // ';' indicates an SGF game node
            clearValue();
            tokens.push({ type: ';', nodeId: ++nodeId });
        } else if (character === '\n') {
            clearValue();
            tokens.push({ type: 'newline', value: '\n' });
        } else if (' \t'.includes(character)) {
            clearValue();
            tokens.push({ type: 'whitespace', value: character })
        } else {
            // erroneous character
            clearValue();
            tokens.push({
                type: 'error',
                value: character,
                error: 'invalidCharacter'
            });
        }
    }
    return tokens;
}

const makeNodes = async (tokens) => {
    const code = document.querySelector('code');
    // a node should be either '(', ')',
    // or it's a proper node, which consists of a dom element
    // and an array of properties
    const nodes = [];

    // create a node to contain sgf ';' nodes
    let node = { properties: {} };
    // certain tokens expect a specific followup token; 
    // we can track this in the 'expected' variable
    let expected = '';
    // track whether we're in a node to determine whether a character is erroneous
    let inNode = false;
    // track last propIdent for assigning propVal; 
    // if there is no property identifier, assign values to key 'error'
    let propIdent = 'error';

    // if the node object has contents, push it and clear it,
    // creating a new node object in the 'node' variable
    const clearNode = () => {
        const length = Object.keys(node.properties).length;
        // if length is 0, the node is empty and no action is necessary
        if (length) {
            if (!inNode) {
                node.type = 'error';
                node.error = 'missing-semicolon';
            } else if (length === 1) node.error = 'empty-node';
            node.dom.class = `sgf-${node.type}`;
            nodes.push(node);
            code.append(node.dom);
            node = { properties: {} };
        }
    }

    // keep track of propertyValue span, 
    // since propVals are split up between tokens
    let propVal;

    // iterate through tokens to create nodes
    for (let i=0; i < tokens.length; i++) {
        let tok = tokens[i];
        if (expected) {
            if (tok.type !== expected) {
                tok.expected = expected;
                // !! TODO !!
                // eventually this should indicate an error of some sort
            }
            expected = '';
        }
        if (tok.type === '(' || tok.type === ')') {
            // these begin and end game trees; 
            // they are only relevant for the following recursive function
            clearNode();
            code.append(tok.type);
            propIdent = 'error';
            inNode = false;
            nodes.push(tok);
        } else if (tok.type === ';') {
            // indicates a new node
            clearNode();
            inNode = true;
            propIdent = 'error';
            node.dom = document.createElement('span');
            node.dom.append(';');
            node.dom.classList.add('sgf-node');
            node.id = tok.nodeId;
            node.dom.dataset.nodeId = node.id;
        } else if (tok.type === 'propertyIdentifier') {
            expected = '[';
            propIdent = tok.value;
            // create key, value pair in node.properties
            node.properties[propIdent] = [];
            // create and append span element to sgf-node element 
            const property = document.createElement('span');
            property.classList.add('sgf-property-identifier');
            property.append(propIdent);
            node.dom.append(property);
        } else if (tok.type === '[') {
            expected = 'propertyValue';
            // create dom span and point to it with propertyValue variable
            propVal = document.createElement('span');
            propVal.append('[');
            propVal.classList.add('sgf-property-value');
        } else if (tok.type === 'propertyValue') {
            // append token value to propertyValue dom element
            if (tok.value === '\n') {
                propVal.append(document.createElement('br'));
                continue;
            }
            if (tok?.escaped) {
                const escaped = document.createElement('span');
                escaped.classList.add('sgf-escaped');
                escaped.append('\\', tok.value);
                propVal.append(escaped);
            } else propVal.append(tok.value);
            if (tok?.error === 'missingClose') {
                // missing ']' at end of property value
                if (inNode) {
                    propVal.classList.add('sgf-error-missing-close');
                    node.dom.append(propVal);
                    node.properties[propIdent].push(propVal.textContent);
                } else {
                    propVal.classList.add('sgf-error');
                }
            }
        } else if (tok.type === ']') {
            // append propertyValue to dom object and to properties array
                propVal.append(']');
                node.dom.append(propVal);
                node.properties[propIdent].push(propVal.textContent);
        } else if (tok.type === 'newline') {
            // append a newline to the 
            if (!node.dom) node.dom = document.createElement('span');
            node.dom.append(document.createElement('br'));
        } else if (tok.type === 'whitespace') {
            // non-breaking space to ensure proper spacing is maintained
            if (tok.value === ' ') node.dom.append('&nbsp');
            // otherwise it's a \t
            else node.dom.append(tok.value);
        } else if (tok.type === 'error') {
            const error = document.createElement('span');
            error.classList.add('sgf-error');
            error.append(tok.value);
            if (node.dom) node.dom.append(error);
            else code.append(error);
        }
    }

    return nodes;
}

const visualTest = async (nodes) => {
    // a nested pre-code thing will contain the SGF text
    const code = document.querySelector('code');

    for (let i=0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node?.type) {
            code.append(node?.type);
        } else code.append(node.dom);
    }
}

const syntaxTest = async () => {
    let sgf = document.querySelector('textarea').value;
    tokenize(sgf)
    .then(tokens => makeNodes(tokens))
    //.then(nodes => visualTest(nodes));
}

const makeLines = async () => {
    return document.querySelector('textarea').value.split('\n').map((line) => {
        const element = document.createElement('div');
        element.classList.add('bt-line');
        element.append(line);
        return element;
    });
}

const scroll = async () => {
    const code = document.querySelector('code');
    const lineHeight = document.querySelector('.bt-line').getBoundingClientRect().height | 20;
    const btContainer = document.querySelector('.bt-vertical-scroll');

    const editorHeight = btContainer.getBoundingClientRect().height;
    const numberLinesAbove = Math.floor(btContainer.scrollTop / lineHeight);

    const numberLinesBelow = Math.floor((code.offsetHeight-editorHeight-btContainer.scrollTop)/lineHeight);

    if (numberLinesAbove > 10) {
        if (code.firstChild !== window.spacerTop) code.insertBefore(window.spacerTop, code.firstChild);
        while (window.spacerTop.offsetHeight < (numberLinesAbove-11) * lineHeight) {
            window.spacerTop.style.height = `${window.spacerTop.offsetHeight + lineHeight}px`;
            window.linesAbove.push(code.removeChild(code.childNodes[1]));
        }
        while (window.spacerTop.offsetHeight > (numberLinesAbove-10) * lineHeight) {
            code.insertBefore(window.linesAbove.pop(), code.childNodes[1]);
            window.spacerTop.style.height = `${window.spacerTop.offsetHeight - lineHeight}px`;
        }
    } else {
        if (code.firstChild === window.spacerTop) code.removeChild(window.spacerTop);
        while (window.linesAbove.length) {
            code.insertBefore(window.linesAbove.pop(),code.firstChild);
        }
    }

    if (numberLinesBelow > 10) {
        if (code.lastChild !== window.spacerBottom) code.append(window.spacerBottom);
        while (window.spacerBottom.offsetHeight < (numberLinesBelow - 11) * lineHeight) {
            window.spacerBottom.style.height = `${window.spacerBottom.offsetHeight + lineHeight}px`;
            window.linesBelow.push(code.removeChild(code.childNodes[code.childNodes.length-2]));
        }
        while (window.spacerBottom.offsetHeight > (numberLinesBelow - 10) * lineHeight) {
            code.insertBefore(window.linesBelow.pop(), code.lastChild);
            window.spacerBottom.style.height = `${window.spacerBottom.offsetHeight - lineHeight}px`;
        }
    } else {
        if ([...code.childNodes].includes(window.spacerTop)) code.removeChild(window.spacerTop);
        while (window.linesBelow.length) {
            code.append(window.linesBelow.pop());
        }
    }
}

document.addEventListener('DOMContentLoaded', e => {
    window.spacerTop = document.createElement('div');
    window.spacerTop.classList.add('bt-spacer');
    window.spacerBottom = document.createElement('div');
    window.spacerBottom.classList.add('bt-spacer');

    document.querySelector('.bt-vertical-scroll').addEventListener('scroll',scroll);
    document.querySelector('button').addEventListener('click', e => {
        const code = document.querySelector('code');
        code.textContent = '';
        makeLines()
        .then(lines => {
            window.linesAbove = [...lines];
            window.linesBelow = [];
            const lineHeight = lines[0].offsetHeight;
            window.spacerTop.style.height = `${window.spacerTop.offsetHeight + lineHeight*window.linesAbove.length}px`;
            code.append(window.spacerTop,lines[lines.length-1],window.spacerBottom);
            return;
        })
        .then(e => {
            scroll();
        });
    });
})

//export default syntaxTest;