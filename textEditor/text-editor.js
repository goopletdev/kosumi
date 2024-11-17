import HighlightSGF from './sgf-syntax.js';
import * as lazy from '../lazy-dom.js';
import SGF from '../sgf/sgf.js';

/**
 * @module TextEditor
 */
class TextEditor {
    /**
     * Creates and appends the Kosumi TextEditor DOM element
     * @param {Node} parent TextEditor HTML parent element
     */
    constructor(parent) {
        this.activeNode = -1;
        this.history = [];
        this.currentText = '';

        this.parent = parent;

        this.container = lazy.div(['editorContainer', 'teInput'], this.parent);
        this.header = lazy.header(['editorHeader'], this.container, null, 'Kosumi 0.1.0');

        this.mainWrapper = lazy.div(['editorWrapper'], this.container);
        this.textarea = lazy.textarea(['editorTextarea'],this.mainWrapper);
        this.textarea.spellcheck = false;
        this.textarea.autofocus;
        this.textarea.ariaHidden = true;
        this.textarea.placeholder = 'Paste SGF...'
        this.pre = lazy.pre(['line-container'],this.mainWrapper);
        this.lines = lazy.code(['lines'],this.pre);

        this.footer = lazy.footer(['editorFooter'], this.container);

        this.toolbar = lazy.div(['editorToolbar'],this.footer,'toolbar');
        this.formatButton = lazy.button(['editorButton'],this.toolbar,'format','Format SGF');
        this.formatButton.addEventListener('click', () => this.format());
        
        this.caret = lazy.div([],this.footer,'caretInfo');

        this.mode = 'INSERT';
        this.vimCount = '';
        this.vimCommand = '';

        let that = this;
        this.textarea.addEventListener('focus', (e) => {
            function selectionobserver() {
                that.caretPosition();
                if (that.hasOwnProperty('_walker')) {
                    that._walker.id(that.activeNode);
                    that._walker.update();
                }
            }
            e.target.addEventListener('selectionchange', selectionobserver);
            e.target.addEventListener('blur', () => {
                e.target.removeEventListener('selectionchange',selectionobserver);
            })
        })

        this.textarea.addEventListener('scroll', () => this.syncScroll());
        this.textarea.addEventListener('change', () => this.sync());
        this.textarea.addEventListener('input', () => this.sync());
        lazy.resizeObserve(this.textarea, () => this.sync());
    }

    format() {
        this.history.push(this.textarea.value);
        this._walker.collection = SGF.parse(this.history[this.history.length-1]);
        this._walker.game = this._walker.collection[0];

        this.currentText = SGF.stringify(this._walker.root);
        this.textarea.value = this.currentText;
        this.updateLines();

        if (!this.toggleButton) {
            this.toggleButton = lazy.button('editorButton',this.toolbar,'toggleButton');
            this.toggleButton.addEventListener('click',() => this.toggleSGF());
        }
        this.toggleButton.textContent = 'show old SGF';

        this.update();
    }

    toggleSGF() {
        if (this.toggleButton.textContent === 'show old SGF') {
            this.toggleButton.textContent = 'show new SGF';
            this.textarea.value = this.history[this.history.length-1];
        } else {
            this.toggleButton.textContent = 'show old SGF';
            this.textarea.value = this.currentText;
        }
        this.updateLines();
        this.update();
    }

    /**
     * @param {object} walkerObject
     */
    set walker(walkerObject) {
        this._walker = walkerObject;
        this.textarea.addEventListener('change', (e) => {
            walkerObject.collection = SGF.parse(e.target.value);
            walkerObject.game = walkerObject.collection[0];
            walkerObject.update();
        });
        this.textarea.addEventListener('input', (e) => {
            walkerObject.collection = SGF.parse(e.target.value);
            walkerObject.game = walkerObject.collection[0];
            walkerObject.update();
        });
    }

    updateLines() {
        let activeLine = this.textarea.value.slice(
            0,this.textarea.selectionStart
        ).split('\n').length-1;

        let lines = HighlightSGF(Array.from(
            this.textarea.value.split('\n'), line => line ||= ' '
        ).join('\n'));

        while (this.lines.childNodes.length > lines.length) {
            this.lines.removeChild(this.lines.childNodes[activeLine]);
        }
        while (this.lines.childNodes.length < lines.length) {
            let newLine = lazy.div('line');
            this.lines.insertBefore(
                newLine,this.lines.childNodes[activeLine+1]
            );
        }
    
        for (let i=0; i< lines.length; i++) {
            if (this.lines.childNodes[i].textContent !== lines[i].textContent) {
                this.lines.removeChild(this.lines.childNodes[i]);
                this.lines.insertBefore(lines[i], this.lines.childNodes[i])
            }
        }
    }

    caretPosition() {
        this.beginSelect = this.textarea.selectionStart;
        let endSelect = this.textarea.selectionEnd;
        let textToCursor = this.textarea.value.slice(0,this.beginSelect);
        let linesToCursor = textToCursor.split('\n');
        let activeLineFirst = linesToCursor.length;
        this.column = linesToCursor[activeLineFirst-1].length+1;
        let activeLineLast = this.textarea.value.slice(0,endSelect).split('\n').length;

        let selected = '';
        if (this.beginSelect !== endSelect) {
            selected += ` (${endSelect-this.beginSelect} selected)`
        }

        // find number of nodes up to cursor
        let nodeNumber = -1;
        this.inBrackets = false;
        let escaped = false;
        for (let i = 0; i < textToCursor.length; i++) {
            if (escaped) {
                escaped = false;
            } else if (this.inBrackets) {
                if (textToCursor[i] === ']') {
                    this.inBrackets = false;
                }
            } else if (textToCursor[i] === '[') {
                this.inBrackets = true;
            } else if (textToCursor[i] === ';') {
                nodeNumber++;
            }
        }
        if (nodeNumber < 0) {
            this.activeNode = 'none';
        } else {
            this.activeNode = nodeNumber;
        }

        this.lines.childNodes.forEach((element, i) => {
            if (activeLineFirst <= i+1 && i+1 <= activeLineLast) {
                element.classList.add('activeLine');
            } else {
                element.classList.remove('activeLine');
            }
        })

        this.caret.textContent = '';
        lazy.text(this.caret,`--${this._mode}-- \u00A0`);
        lazy.text(this.caret,`\u00A0 Node (${this.activeNode}) \u00A0`);
        lazy.text(this.caret,`\u00A0 Ln ${activeLineFirst}, Col ${this.column}${selected}\u00A0`);
    }

    syncScroll() {
        this.lines.scrollTop = this.textarea.scrollTop;
    }

    sync() {
        this.updateLines();
        this.caretPosition();
        this.syncScroll();
    }

    /**
     * @param {string} newMode
     */
    set mode(newMode) {
        if (!TextEditor.modes.includes(newMode)) {
            throw new Error(`${newMode} is not a valid BadText mode`);
        } else {
            this._mode = newMode;
            this.container.classList.remove(
                ...TextEditor.modes.map((c) => `bt${c}`)
            );
            this.container.classList.add(`bt${newMode}`);
        }
    }

    /**
     * @param {number} targetNodeNumber 
     */
    set caretToNode(targetNodeNumber) {
        // find number of nodes up to cursor
        let nodeNumber = -1;
        this.inBrackets = false;
        let escaped = false;
        let position = 0;
        for (let char of this.textarea.value) {
            position++;
            if (escaped) {
                escaped = false;
            } else if (this.inBrackets) {
                if (char === ']') {
                    this.inBrackets = false;
                }
            } else if (char === '[') {
                this.inBrackets = true;
            } else if (char === ';') {
                nodeNumber++;
            }
            if (nodeNumber === targetNodeNumber) {
                this.textarea.setSelectionRange(position,position);
                this.caretPosition();
                break;
            }
        }
        //this.caretPosition();
    }

    update() {
        if (document.activeElement !== this.textarea) {
            this.caretToNode = this._walker.currentNode.id;

            // handle scrolling when active line is not visible
            let linesTop = this.lines.getBoundingClientRect().top;
            let linesBottom = this.lines.getBoundingClientRect().bottom;
            for (let child of this.lines.childNodes) {
                if (child.classList.contains('activeLine')) {
                    let childUpper = child.getBoundingClientRect().top;
                    let childLower = child.getBoundingClientRect().bottom;
                    if (childUpper < linesTop) {
                        this.textarea.scrollTop = this.textarea.scrollTop - linesTop + childUpper;
                    } else if (childLower > linesBottom) {
                        this.textarea.scrollTop = this.textarea.scrollTop + childLower - linesBottom;
                    }
                }
            }
        }
    }

    static modes = [
        'INSERT',
        'VIMish',
        'COMMAND',
    ]
}


export default TextEditor;