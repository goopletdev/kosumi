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
        this.footer.style.paddingRight = '1em';

        this.toolbar = lazy.div(['editorToolbar'],this.footer,'toolbar');
        this.formatButton = lazy.button(['editorButton'],this.toolbar,'format','Format SGF');
        lazy.listen(this.formatButton,'click', () => this.format());
        
        this.caret = lazy.div([],this.footer,'caretInfo');
        /*this.toolbarMode = lazy.span('toolbarInfo', this.caret, null, '-- --');
        this.toolbarNode = lazy.span('toolbarInfo', this.caret, null, 'Node ( )');
        this.toolbarLine = lazy.span('toolbarInfo', this.caret, null, 'Ln  ,');
        this.toolbarColumn = lazy.span('toolbarInfo', this.caret, null, 'Col  ');
        this.toolbarSelected = lazy.span('toolbarInfo', this.caret, null, ' '); */

        this.mode = 'INSERT';
        this.vimCount = '';
        this.vimCommand = '';

        lazy.listen(this.textarea, 'selectionchange', () => this.caretPosition());
        lazy.listen(this.textarea, 'scroll', () => this.syncScroll());
        lazy.listen(this.textarea, 'change', () => this.sync());
        lazy.listen(this.textarea, 'input', () => this.sync());
        lazy.resizeObserve(this.textarea, () => this.sync());

    }

    format() {
        this.history.push(this.textarea.value);
        this._walker.collection = SGF.parse(this.history[this.history.length-1]);
        this._walker.game = this._walker.collection[0];

        this.currentText = SGF.stringify(this._walker.root);
        this.textarea.value = this.currentText;
        this.update();

        if (!this.toggleButton) {
            this.toggleButton = lazy.button('editorButton',this.toolbar,'toggleButton');
            lazy.listen(this.toggleButton,'click',() => this.toggleSGF());
        }
        this.toggleButton.textContent = 'show old SGF';
    }

    toggleSGF() {
        if (this.toggleButton.textContent === 'show old SGF') {
            this.toggleButton.textContent = 'show new SGF';
            this.textarea.value = this.history[this.history.length-1];
        } else {
            this.toggleButton.textContent = 'show old SGF';
            this.textarea.value = this.currentText;
        }
        this.update();
    }

    /**
     * @param {object} walkerObject
     */
    set walker(walkerObject) {
        this._walker = walkerObject;
        lazy.listen(this.textarea, 'change', () => {
            let value = this.textarea.value;
            walkerObject.collection = SGF.parse(value);
            walkerObject.game = walkerObject.collection[0];
            walkerObject.update();
        });
        lazy.listen(this.textarea, 'input', () => {
            let value = this.textarea.value;
            walkerObject.collection = SGF.parse(value);
            walkerObject.game = walkerObject.collection[0];
            walkerObject.update();
        });
        lazy.listen(this.textarea, 'selectionchange', () => {
            // handle moving caret
            if (walkerObject.currentNode.id !== this.activeNode) {
                walkerObject.id(this.activeNode);
                walkerObject.update();
            }
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
        let selected = '';
        let textToCursor = this.textarea.value.slice(0,this.beginSelect);
        let linesToCursor = textToCursor.split('\n');
        let activeLineFirst = linesToCursor.length;
        this.column = linesToCursor[activeLineFirst-1].length+1;
        let activeLineLast = this.textarea.value.slice(0,endSelect).split('\n').length;

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
        lazy.text(this.caret,`--${this._mode}--\u00A0`);
        lazy.text(this.caret,`\u00A0Node (${this.activeNode})\u00A0`);
        lazy.text(this.caret,`\u00A0Ln ${activeLineFirst}, Col ${this.column}${selected}\u00A0`);

        /*let activeInfo = `--${this._mode.toUpperCase()}-- Node (${this.activeNode}) | Ln ${activeLineFirst}, Col ${this.column}${selected} `;
    
        if (this.caret.textContent !== activeInfo) {
            this.caret.textContent = activeInfo;
        }*/
    }

    syncScroll() {
        this.lines.scrollTop = this.textarea.scrollTop;
    }

    sync() {
        this.update();
        this.caretPosition();
        this.syncScroll();
    }
}


export default TextEditor;