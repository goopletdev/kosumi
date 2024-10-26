class TextEditor {
    constructor(parent) {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('editorContainer');
        this.parent.appendChild(this.container);

        this.header = document.createElement('header');
        this.header.classList.add('editorHeader');
        this.header.innerText = 'Kosumi 1.0'
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

        this.caret = document.createElement('div');
        this.caret.id = 'caret';
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
        let activeLine = this.textarea.value.slice(0,this.textarea.selectionStart).split('\n').length-1;
        let lines = Array.from(this.textarea.value.split('\n'), line => line ||= ' ');
    
        while (this.lines.childNodes.length > lines.length) {
            this.lines.removeChild(this.lines.childNodes[activeLine]);
            this.lineNumbers.removeChild(this.lineNumbers.lastChild);
        }
        while (this.lines.childNodes.length < lines.length) {
            let newLine = document.createElement('div');
            newLine.classList.add('line');
            this.lines.insertBefore(newLine,this.lines.childNodes[activeLine+1]);
    
            let newLineNumber = document.createElement('div');
            newLineNumber.classList.add('lineNumber');
            newLineNumber.innerText = this.lineNumbers.childNodes.length + 1;
            this.lineNumbers.appendChild(newLineNumber);
        }
    
        for (let i=0; i< lines.length; i++) {
            if (this.lines.childNodes[i].innerText !== lines[i] + '\n') {
                this.lines.childNodes[i].innerText = lines[i] + '\n';
            }
            if (this.lineNumbers.childNodes[i].offsetHeight > this.lines.childNodes[i].offsetHeight) {
                this.lineNumbers.childNodes[i].innerText = i+1;
            }
            while (this.lineNumbers.childNodes[i].offsetHeight < this.lines.childNodes[i].offsetHeight) {
                this.lineNumbers.childNodes[i].innerText += '\n';
            }
        }

        //let highlighted = `<div>${text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;")}</div>`;    
    }

    caretPosition() {
        let beginSelect = this.textarea.selectionStart;
        let endSelect = this.textarea.selectionEnd;
        let selected = '';
        let textToCursor = this.textarea.value.slice(0,beginSelect).split('\n');
        let activeLineFirst = textToCursor.length;
        let column = textToCursor[activeLineFirst-1].length+1;
        let activeLineLast = this.textarea.value.slice(0,endSelect).split('\n').length;
    
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
    
        this.caret.innerText = `Ln ${activeLineFirst}, Col ${column}${selected}`;
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