const COLORS = { // default color values
    wood: 'burlywood',
    line: 'black',
    player: [
        ,
        'black',
        'white',
    ],
    background: '#deb7ff',
}

const STARS = { 
    9: [20,24,40,56,60],
    13: [42, 81, 120, 45, 84, 123, 48, 87, 126],
    19: [60, 174, 288, 66, 180, 294, 72, 186, 300]
}

const COORDS = {
    'sgf': Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    'A': Array.from('ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz'),
    '1': Array(50).map((_,i) => i + 1),
}

const starPoints = (width,height=width) => {
    if (width === height && STARS[width]) {
        return STARS[width];
    } else if (width % 2 && height % 2) {
        return Math.floor(width/2) + Math.floor(height/2) * width;
    } else return [];    
}

const newCanvas = (canvases, canvasName) => {
    const canv = document.createElement('canvas');
    canv.classList.add('gobanCanvas');
    const ctx = canv.getContext('2d');
    canvases.container.append(canv);

    canvases[canvasName] = canv;
    canvases[`${canvasName}Context`] = ctx;
}

const canvases = () => {
    const elements = { container: document.createElement('div') };
    elements.container.classList.add('gobanContainer');

    ['goban','stones','annotations'].forEach(k => newCanvas(elements, k));

    return elements;
}

import GameEngine from "../stoneWalker/game-engine-class.js";

class GobanCanvas extends GameEngine {
    constructor (width=19, height=width, parent, players=2, toPlay=1) {
        super(width, height);

        // assign default colors
        this.colors = COLORS;

        // create new DOM objects and canvas contexts
        Object.assign(this, canvases());

        // number of players and next player to play
        this.numberPlayers = players;
        this.activePlayer = toPlay;
        this.currentColor = toPlay;

        this.coordStyle = 'sgf';
        this.cursor = [0,0];
        this.tool = this.play;

        this.fontFamily = 'ubuntu-condensed';

        // append to parent and add event listeners
        if (parent) this.parent = parent;


    }

    async font (fontFamily, fontSource) {
        this.fontFace = new FontFace(fontFamily,fontSource);
        this.fontFamily = fontFamily;
    }

    setCanvasSize () {
        const bounds = this.container.getBoundingClientRect();
        this.lineSpacing = (bounds.bottom-bounds.top)/(this.height+2);

        this.fontSize = this.lineSpacing - 5;
        this.gobanContext.font = `${this.fontSize}px ${this.fontFamily}`;

        ['goban','stones','annotations'].forEach(key => {
            this[key].width = this.lineSpacing * (this.width + 2);
            this[key].height = this.lineSpacing * (this.height + 2);
        });

        
    }

    mouseLocation (offsetX,offsetY) {
        let x = Math.round(offsetX / this.lineSpacing - 1.5);
        let y = Math.round(offsetY / this.lineSpacing - 1.5);
        return [x,y];
    }

    getCoordinate (coord) {
        return COORDS[this.coordStyle][coord];
    }

    initGoban () {
        // fill goban background color
        this.gobanContext.fillStyle = this.colors.wood;
        this.gobanContext.fillRect(0,0,this.goban.width,this.goban.height);
        // draw grid's thicker outer rectangle
        this.gobanContext.strokeStyle = this.colors.line;
        this.gobanContext.lineWidth = Math.max(this.lineSpacing/13, 2);
        this.gobanContext.strokeRect(
            this.lineSpacing * 1.5,
            this.lineSpacing * 1.5,
            this.lineSpacing * (this.width - 1),
            this.lineSpacing * (this.height - 1)
        );
        // draw grid
        this.gobanContext.lineWidth = Math.max(this.lineSpacing/25, 1);
        this.gobanContext.beginPath();
        for (let y=1; y < this.height-1; y++) {
            this.gobanContext.moveTo(
                this.lineSpacing*1.5, this.lineSpacing*(y+1.5)
            );
            this.gobanContext.lineTo(
                this.lineSpacing*(this.width+0.5), this.lineSpacing*(y+1.5)
            );
        }
        for (let x=1; x < this.width-1; x++) {
            this.gobanContext.moveTo(
                this.lineSpacing*(x+1.5), this.lineSpacing*1.5
            );
            this.gobanContext.lineTo(
                this.lineSpacing*(x+1.5), this.lineSpacing*(this.height+0.5)
            );
        }
        this.gobanContext.stroke();
        // draw stars
        this.gobanContext.fillStyle = this.colors.line;
        starPoints(this.width,this.height).forEach(star => {
            this.gobanContext.beginPath();
            const [x,y] = this.deepen(star);
            this.gobanContext.arc(
                this.lineSpacing*(x+1.5),
                this.lineSpacing*(y+1.5),
                this.lineSpacing/7.6,
                0,
                Math.PI*2
            );
            this.gobanContext.fill();
        });
        // draw coordinates
        this.fontSize = this.lineSpacing - 5;
        this.gobanContext.font = `${this.fontSize}px ubuntu-condensed`;
        this.gobanContext.textAlign = 'center';
        this.gobanContext.textBaseline = 'middle';
        for (let i=0; i < this.width; i++) {
            this.gobanContext.fillText(
                this.getCoordinate(i),
                this.lineSpacing*(i+1.5),
                this.lineSpacing*.5
            );
            this.gobanContext.fillText(
                this.getCoordinate(i),
                this.lineSpacing*(i+1.5),
                this.lineSpacing*(this.height+1.5)
            );
        }
        for (let i=0; i < this.height; i++) {
            this.gobanContext.fillText(
                this.getCoordinate(i),
                this.lineSpacing*.5,
                this.lineSpacing*(i+1.5)
            );
            this.gobanContext.fillText(
                this.getCoordinate(i),
                this.lineSpacing*(this.width+1.5),
                this.lineSpacing*(i+1.5)
            );
        }
    }

    drawStone (x,y,color,opacity=1) {
        this.stonesContext.globalAlpha = opacity;
        this.stonesContext.fillStyle = this.colors.player[color];
        this.stonesContext.strokeStyle = this.colors.player[color];

        this.stonesContext.beginPath();
        this.stonesContext.arc(
            this.lineSpacing*(x+1.5),
            this.lineSpacing*(y+1.5),
            (this.lineSpacing/2)-.5,
            0,
            Math.PI*2
        );
        this.stonesContext.fill();
    }

    removeStone (x,y) {
        this.stonesContext.clearRect(
            this.lineSpacing*(x+1),
            this.lineSpacing*(y+1),
            this.lineSpacing,
            this.lineSpacing
        );
    }

    listen () {
        const resize = () => {
            this.setCanvasSize();
            this.initGoban();
        }
        this.resize = new ResizeObserver(resize);
        this.resize.observe(this.container);

        this.annotations.addEventListener('mousedown', e => this.mouseDown(e));
        this.annotations.addEventListener('mouseup', e => this.mouseUp(e));
        this.annotations.addEventListener('mousemove', e => this.mouseMove(e));

        document.defaultView.addEventListener('keydown', e => {
            if (e.key === 'Shift' 
                && this.shiftKey === false 
                && this.cursor 
                && this.tool === this.place
                && !this.state[this.flatten(this.cursor)]) {
                this.removeStone(this.cursor[0],this.cursor[1]);
                this.drawStone(this.cursor[0],this.cursor[1],this.calculateNexPlayer(this.currentColor),0.5);
                this.shiftKey = true;
            } else if (e.key === 'Shift') this.shiftKey = true;
    });
        document.addEventListener('keyup', e => {
            if (e.key === 'Shift' 
                && this.cursor 
                && this.tool === this.place
                && !this.state[this.flatten(this.cursor)]) {
                this.removeStone(this.cursor[0],this.cursor[1]);
                this.drawStone(this.cursor[0],this.cursor[1],this.currentColor,0.5);
                this.shiftKey = false;
            } else if (e.key === 'Shift') this.shiftKey = false;
        });
    }

    mouseMove (e) {
        const [x,y] = this.mouseLocation(e.offsetX,e.offsetY);
        let color = this.currentColor;
        if (this.shiftKey && this.tool !== this.play) color = this.calculateNexPlayer(color);
        if (this.cursor?.[0] === x && this.cursor[1] === y) return;
        if (this.cursor && !this.state[this.flatten(this.cursor)]) {
            this.removeStone(this.cursor[0],this.cursor[1]);
        }
        if (x < 0 || y < 0 || x > this.width-1 || y > this.height-1) {
            this.cursor = null;
            return;
        }
        if (!this.state[this.flatten([x,y])]) {
            this.drawStone(x,y,color,0.5);
        }

        this.cursor = [x,y];
    }

    mouseDown (e) {
        const [x,y] = this.mouseLocation(e.offsetX,e.offsetY);
        if (x < 0 || y < 0 || x > this.width-1 || y > this.height-1) return;
        this.clickPosition = [x,y];
    }

    mouseUp (e) {
        const [x,y] = this.mouseLocation(e.offsetX,e.offsetY);
        if (x < 0 || y < 0 || x > this.width-1 || y > this.height-1) {
            this.clickPosition = [null,null];
            return;
        }
        if (this.clickPosition[0] === x && this.clickPosition[1] === y) {
            // mouse didn't move; simple click
            this.tool(x,y,e.altKey);
        } else {
            // click and drag

        }
        this.clickPosition = [null,null];
    }

    /**
     * Updates boardstate with GameEngine.move(),
     * places stone on canvas, switches this.nextPlayer,
     * removes captured stones
     * @param {*} x 
     * @param {*} y 
     */
    play (x,y) {
        const captures = this.move(this.activePlayer, this.flatten([x,y]));
        this.drawStone(x,y,this.activePlayer);
        this.activePlayer = this.calculateNexPlayer();
        captures.forEach(color => {
            color.forEach(stone => this.removeStone(...this.deepen(stone)));
        });
        this.currentColor = this.activePlayer;
    } 

    /**
     * For setting up a position; 
     * does not execute captures or change player color
     * @param {number} x 0-index goban column
     * @param {number} y 0-index goban row
     */
    place (x,y) {
        const flat = this.flatten([x,y]);
        const c = this.currentColor;
        if (this.state[flat]) this.removeStone(x,y);
        if (this.state[flat] !== c) {
            this.drawStone(x,y,this.shiftKey ? this.calculateNexPlayer(c) : c);
        }
        this.setup(c, flat);
    }

    calculateNexPlayer (color = this.activePlayer) {
        return color >= this.numberPlayers ? 1 : color + 1;
    }

    set parent (parentElement) {
        // add and connect parent element
        this._parent = parentElement;
        parentElement.append(this.container);
        // set canvas size according to parent size
        this.setCanvasSize();
        // add event listeners
        this.listen();
        // draw goban onto goban canvas
        this.initGoban();
    }

    get parent () {
        return this._parent;
    }

    set toolPanel (element) {
        const that = this;
        this._toolPanel = document.createElement('div');
        element.append(this._toolPanel);
        this.tools = {
            play: document.createElement('button'),
        };
        this.tools.play.addEventListener('click', () => {
            that.currentColor = that.activePlayer;
            that.tool = that.play;
        });
        this.tools.play.textContent = 'Play';

        for (let i=1; i <= this.numberPlayers; i++) {
            this.tools[`place${i}`] = document.createElement('button');
            this.tools[`place${i}`].addEventListener('click', () => {
                that.currentColor = i; 
                that.tool = that.place;
            });
            this.tools[`place${i}`].textContent = `Place ${that.colors.player[i]}`;
        }

        Object.values(this.tools).forEach(element => element.classList.add('kosumiNavigationButton'))

        this._toolPanel.append(...Object.values(this.tools));
    }

    get toolPanel () {
        return this._toolPanel;
    }
}

export default GobanCanvas;