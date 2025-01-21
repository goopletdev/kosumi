class BadText {
    constructor (parentElement) {
        this.text = '';
        this.selection = [-1,-1];
        this.lines = [];


        this.editor = document.createElement('div');
        this.editor.classList.add('bt-editor');
        parentElement.append(this.editor);

        this.verticalScroll = document.createElement('div');
        this.verticalScroll.classList.add('bt-vertical-scroll');
        this.editor.append(this.verticalScroll);

        this.lineNumbers = document.createElement('div');
        this.lineNumbers.classList.add('bt-line-numbers');
        this.lineNumbers.style.userSelect = 'none';
        this.divider = document.createElement('div');
        this.divider.classList.add('bt-divider');
        this.code = document.createElement('div');
        this.code.contentEditable = 'true';
        this.code.tabIndex = '-1';
        this.code.append(this.newLine());
        this.verticalScroll.append(this.lineNumbers,this.divider,this.code);

        this.code.addEventListener('input', () => this.syncNumbers()); 


    }

    syncNumbers() {
        while (this.code.childElementCount > this.lineNumbers.childElementCount) {
            const lineNumber = document.createElement('div');
            this.lineNumbers.append(lineNumber);
            lineNumber.append(this.lineNumbers.childElementCount);
        }
        while (this.lineNumbers.childElementCount > this.code.childElementCount) {
            this.lineNumbers.removeChild(this.lineNumbers.lastChild);
        }
        for (let i=0; i <= this.code.childElementCount; i++) {
            const line = this.code.childNodes[i];
            const number = this.lineNumbers.childNodes[i];
            if (line.style.height !== number.style.height) {
                line.style.height = number.style.height;
            }
        }
    }

    newLine(contents = document.createElement('br')) {
        const line = document.createElement('div');
        line.classList.add('bt-line');
        line.append(contents);
        this.lines.push(line);
        return line;
    }
}