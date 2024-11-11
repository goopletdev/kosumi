/**
 * 
 * @param {object} textEditor 
 */
function addListeners(textEditor) {
    let text = textEditor.textarea;
    text.addEventListener('input', function(event) {
        console.log(event);
        let caret = text.selectionStart;
        let charAfterCursor = text.value[caret];
        if (event.data === ';' && text.value[caret-2] !== '\n') {
            text.value = text.value.slice(0,caret-1) + '\n;' + text.value.slice(caret);
            text.setSelectionRange(caret+1,caret+1);
        } else if (event.data === '(') {
            let newline = text.value[caret-2] === '\n' || caret === 1 ? '' : '\n';
            let skipChars = 0;
            if (text.value[caret] === '\n' && text.value[caret+1]) {
                skipChars++;
            }
            text.value = text.value.slice(0,caret-1) + newline + '(;\n)' + text.value.slice(caret+skipChars);
            if (newline === '\n') {
                text.setSelectionRange(caret+2,caret+2);
            } else {
                text.setSelectionRange(caret+1,caret+1);
            }
        } else if (event.data === ')' && charAfterCursor === ')') {
            text.value = text.value.slice(0,caret-1) + text.value.slice(caret);
            text.setSelectionRange(caret,caret);
        } else if (event.data === '[') {
            text.value = text.value.slice(0,caret-1) + '[]' + text.value.slice(caret);
            text.setSelectionRange(caret,caret);
        } else if (event.data === ']' && charAfterCursor === ']') {
            text.value = text.value.slice(0,caret-1) + text.value.slice(caret);
            text.setSelectionRange(caret,caret);
        }
        textEditor.sync();
    })
}

export {addListeners}