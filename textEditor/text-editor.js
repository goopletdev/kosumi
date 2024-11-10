import HighlightSGF from './sgf-syntax.js';

/**
 * @module TextEditor
 */
class TextEditor {
    /**
     * Creates and appends the Kosumi TextEditor DOM element
     * @param {HTMLElement} parent TextEditor HTML parent element
     */
    constructor(parent) {
        this.activeNode = -1;

        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('editorContainer');
        this.parent.appendChild(this.container);

        this.header = document.createElement('header');
        this.header.classList.add('editorHeader');
        this.header.innerText = 'Kosumi 0.1.0'
        this.container.appendChild(this.header);

        this.mainWrapper = document.createElement('div');
        this.mainWrapper.classList.add('editorWrapper');
        this.container.appendChild(this.mainWrapper);

        this.lineNumbers = document.createElement('div');
        this.lineNumbers.classList.add('lineNumbers');
        this.mainWrapper.appendChild(this.lineNumbers);

        this.editor = document.createElement('div');
        this.editor.classList.add('editor');
        this.mainWrapper.appendChild(this.editor);

        this.textarea = document.createElement('textarea');
        this.textarea.classList.add('editorTextarea');
        this.textarea.spellcheck = false;
        this.textarea.autofocus;
        this.textarea.ariaHidden = true;
        this.textarea.placeholder = 'Paste SGF...'
        this.editor.appendChild(this.textarea);

        this.pre = document.createElement('pre');
        this.pre.classList.add('line-container');
        this.editor.appendChild(this.pre);

        this.lines = document.createElement('code');
        this.lines.classList.add('lines');
        this.pre.appendChild(this.lines);

        this.footer = document.createElement('footer');
        this.footer.classList.add('editorFooter');
        this.footer.style.paddingRight = '1em';
        this.container.appendChild(this.footer);

        this.toolbar = document.createElement('div');
        this.toolbar.id = 'toolbar';
        this.toolbar.classList.add('editorToolbar');
        this.footer.appendChild(this.toolbar);

        this.formatButton = document.createElement('button');
        this.formatButton.id = 'format';
        this.formatButton.classList.add('editorButton');
        this.formatButton.innerText = 'Format SGF';
        this.toolbar.appendChild(this.formatButton);

        this.caret = document.createElement('div');
        this.caret.id = 'caretInfo';
        this.footer.appendChild(this.caret);

        const object = this;
        TextEditor.observe(object)

   }

    static observe(object) {
        object.resize = new ResizeObserver(function() {
            object.sync()
        });
        object.resize.observe(object.textarea);
        object.textarea.addEventListener('mouseup',function() {
            object.caretPosition()
        });
        object.textarea.addEventListener('mousedown',function() {
            object.caretPosition()
        });
        object.textarea.addEventListener('keyup',function() {
            object.caretPosition()
        });
        object.textarea.addEventListener('keydown',function() {
            object.caretPosition()
        });
        object.textarea.addEventListener('mousemove',function() {
            object.caretPosition()
        });
        object.textarea.addEventListener('scroll',function() {
            object.syncScroll()
        });
        object.textarea.addEventListener('change',function() {
            object.sync()
        });
        object.textarea.addEventListener('input',function() {
            object.sync()
        });
    }

    update() {
        let activeLine = this.textarea.value.slice(
            0,this.textarea.selectionStart
        ).split('\n').length-1;

        let lines = HighlightSGF(Array.from(
            this.textarea.value.split('\n'), line => line ||= ' '
        ).join('\n'));

        while (this.lines.childNodes.length > lines.length) {
            this.lines.removeChild(this.lines.childNodes[activeLine]);
            this.lineNumbers.removeChild(this.lineNumbers.lastChild);
        }
        while (this.lines.childNodes.length < lines.length) {
            let newLine = document.createElement('div');
            newLine.classList.add('line');
            this.lines.insertBefore(
                newLine,this.lines.childNodes[activeLine+1]
            );
    
            let newLineNumber = document.createElement('div');
            newLineNumber.classList.add('lineNumber');
            newLineNumber.innerText = this.lineNumbers.childNodes.length + 1;
            this.lineNumbers.appendChild(newLineNumber);
        }
    
        for (let i=0; i< lines.length; i++) {
            if (this.lines.childNodes[i].innerHTML !== lines[i]) {
                this.lines.childNodes[i].innerHTML = lines[i];
            }

            // find out whether this is faster than the following commented-out bit
            let lineBounds = this.lines.childNodes[i].getBoundingClientRect();
            let lineHeight = lineBounds.bottom-lineBounds.top;
            this.lineNumbers.childNodes[i].style.height = `${lineHeight}px`
            /*let lineNumberBounds = this.lineNumbers.childNodes[i].getBoundingClientRect();
            let lineNumberHeight = lineNumberBounds.bottom-lineNumberBounds.top;
            if (lineNumberHeight !== lineHeight) {
                this.lineNumbers.childNodes[i].style.height = `${lineHeight}px`;
            }*/
        }
    }

    caretPosition() {
        let beginSelect = this.textarea.selectionStart;
        let endSelect = this.textarea.selectionEnd;
        let selected = '';
        let textToCursor = this.textarea.value.slice(0,beginSelect);
        let linesToCursor = textToCursor.split('\n');
        let activeLineFirst = linesToCursor.length;
        let column = linesToCursor[activeLineFirst-1].length+1;
        let activeLineLast = this.textarea.value.slice(0,endSelect).split('\n').length;

        // find number of nodes up to cursor
        let nodeNumber = -1;
        let inBrackets = false;
        let escaped = false;
        for (let i = 0; i < textToCursor.length; i++) {
            if (escaped) {
                escaped = false;
            } else if (inBrackets) {
                if (textToCursor[i] === ']') {
                    inBrackets = false;
                }
            } else if (textToCursor[i] === '[') {
                inBrackets = true;
            } else if (textToCursor[i] === ';') {
                nodeNumber++;
            }
        }
        if (nodeNumber < 0) {
            this.activeNode = 'none';
        } else {
            this.activeNode = nodeNumber;
        }
    
        if (activeLineFirst === activeLineLast) {
            this.lines.childNodes.forEach((element,i) => {
                element.classList.remove('activeLineFirst');
                element.classList.remove('activeLineLast');
                if (i+1 !== activeLineFirst) {
                    element.classList.remove('activeLine');
                } else {
                    element.classList.add('activeLine');
                }
            })
        } else {
            selected = ` (${endSelect-beginSelect} selected)`;
            this.lines.childNodes.forEach((element,i) => {
                element.classList.remove('activeLine');
                if (i+1 !== activeLineFirst) {
                    element.classList.remove('activeLineFirst');
                } else {
                    element.classList.add('activeLineFirst');
                }
                if (i+1 !== activeLineLast) {
                    element.classList.remove('activeLineLast');
                } else {
                    element.classList.add('activeLineLast')
                }
            });
        }
        this.lineNumbers.childNodes.forEach((element,i) => {
            if (i+1 >= activeLineFirst && i+1 <= activeLineLast) {
                element.classList.add('activeLineNumber');
            } else {
                element.classList.remove('activeLineNumber');
            }
        });

        let activeInfo = `Node (${this.activeNode}) | Ln ${activeLineFirst}, Col ${column}${selected}`;
    
        if (this.caret.innerText !== activeInfo) {
            this.caret.innerText = activeInfo;
        }
    }

    syncScroll() {
        this.lines.scrollTop = this.textarea.scrollTop;
        this.lineNumbers.scrollTop = this.textarea.scrollTop;
    }

    sync() {
        this.update();
        this.caretPosition();
        this.syncScroll();
    }
}


export default TextEditor;