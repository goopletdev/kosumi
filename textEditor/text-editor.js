const textbox = document.getElementById('textbox');
const lineNumbers = document.getElementById('line-numbers');

const textareaStyles = window.getComputedStyle(textbox);
[
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'padding',
].forEach((property) => {
    lineNumbers.style[property] = textareaStyles[property];
});

const displayNumberLines = () => {
    let lines = textbox.value.split('\n').length;
    lineNumbers.innerHTML = Array.from(
        { length: lines }, (_,i) => `<div>${i+1}</div>` 
    ).join('');
}


const lineNumbersSync = () => {
    displayNumberLines();
}

window.lineNumbersSync = lineNumbersSync;