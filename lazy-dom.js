/**
 * @module lazy-dom
 */

/**
 * 
 * @param {keyof HTMLElementTagNameMap} type 
 * @param {string|string[]} classList 
 * @param {Node} parent 
 * @param {string} id
 * @param {string} textContent 
 * @returns {Node}
 */
function dom(type, classList = [], parent, id, textContent) {
    let element = document.createElement(type);
    if (classList) {
        classList = [classList].flat(Infinity); // allows classList to be string or array
        for (let classname of classList) {
            element.classList.add(classname);
        }
    }
    if (id) {
        element.id = id;
    } 
    if (textContent) {
        element.textContent = textContent;
    }
    if (parent) {
        return parent.appendChild(element);
    }
    return element;
}

/**
 * Lazily make/append/return a div node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function div(classes, parent, id, textContent) {
    return dom('div', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a header node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function header(classes, parent, id, textContent) {
    return dom('header', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a pre node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function pre(classes, parent, id, textContent) {
    return dom('pre', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a footer node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function footer(classes, parent, id, textContent) {
    return dom('footer', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a button node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function button(classes, parent, id, textContent) {
    return dom('button', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a textarea node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function textarea(classes, parent, id, textContent) {
    return dom('textarea', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a code node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function code(classes, parent, id, textContent) {
    return dom('code', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a span node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function span(classes, parent, id, textContent) {
    return dom('span', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return a canvas node
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function canvas(classes, parent, id, textContent) {
    return dom('canvas', classes, parent, id, textContent);
}

/**
 * Lazily make/append/return an input node (type number)
 * @param {string} name
 * @param {number} min
 * @param {number} max
 * @param {string|string[]} classes 
 * @param {Node} parent 
 * @param {string} id 
 * @param {string} textContent 
 * @returns {Node}
 */
function inputNum(name, min,max,classes, parent, id, textContent) {
    let element = dom('input', classes, parent, id, textContent);
    if (name) element.name = name;
    if (typeof min === 'number') element.min = min;
    if (max) element.max = max;
    element.type = 'number';
    return element;
}

/**
 * Lazily make/append a text node
 * @param {Node} parent 
 * @param {string} textContents 
 */
function text(parent, textContents) {
    let newTextNode = document.createTextNode(textContents);
    if (parent) {
        parent.appendChild(newTextNode);
    }
}

/**
 * Lazily add an event listener
 * @param {Node} node 
 * @param {string} eventType 
 * @param {Function} func 
 */
function listen(node, eventType, func) {
    node.addEventListener(eventType, func);
}

/**
 * Lazily add/return a resize observer
 * @param {Node} node 
 * @param {Function} func 
 * @returns {ResizeObserver}
 */
function resizeObserve(node, func) {
    let resize = new ResizeObserver(func);
    resize.observe(node);
    return resize;
} 

export {
    div,
    header,
    pre,
    footer,
    button,
    code,
    textarea,
    span,
    canvas,

    text,

    inputNum,
    
    listen,
    resizeObserve,
};