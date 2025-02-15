import { starPoints, coords, COLORS } from "./gobanUtils.js";

class GobanViewer {
    #state;
    #annotationState;
    #width;
    #height;
    #lastMoves = new Set();
    constructor (width=19, height=width, coordStyle='A1', horizontalCoords = 3, verticalCoords = 3) {
        //for storing and manipulating board state
        this.#width = width;
        this.#height = typeof height === 'number' ? height : width;
        this.#state = Array(width * height).fill(0);
        this.#annotationState = Array(width * height).fill(0);

        // assign default colors
        this.colors = COLORS;
        this.fontFamily = 'ubuntu-condensed';

        this.coords = coords(coordStyle || 'A1');
        this.coordDisplay = [horizontalCoords,verticalCoords];

        // create DOM elements and canvas contexts
        this.initDomElements();

        const update = () => this.update();
        this.resize = new ResizeObserver(update);

        const font = new FontFace(
            'ubuntu-condensed',
            'url(./fonts/Ubuntu_Condensed/UbuntuCondensed-Regular.ttf)'
        )

        font.load().then(update);
    }

    /**
     * Coordinate positioning: 
     * 0 = none; 1 = top/left; 2 = bottom/right; 3 = both
     * @param {[{0|1|2|3},{0|1|2|3}]} param0 
     */
    set coordDisplay ([horizontal,vertical]) {
        this.horizontalCoords = horizontal;
        this.topPadding = horizontal % 2;
        this.bottomPadding = horizontal > 1 ? 1 : 0;

        this.verticalCoords = vertical;
        this.leftPadding = vertical % 2;
        this.rightPadding = vertical > 1 ? 1 : 0;

        this.totalWidth = this.width + this.leftPadding + this.rightPadding;
        this.totalHeight = this.height + this.topPadding + this.bottomPadding;
    }

    drawLastMoveMarker (fcoord) {
        const stoneColor = this.colors.player[this.state[fcoord]];
        const color = stoneColor === 'black' ? 'white' : 'black';
        const [x,y] = this.deepen(fcoord);
        this.stones.strokeStyle = color;
        this.stones.lineWidth = Math.max(this.lineSpace/13,1.5);
        this.stones.beginPath();
        this.stones.arc(
            this.lineSpace*(x+this.leftPadding+.5),
            this.lineSpace*(y+this.topPadding+.5),
            this.lineSpace/3.5,0,Math.PI*2
        );
        this.stones.stroke();
        this.updateDomCanvas(x,y,this.stones.canvas);
    }

    set lastMoves (fcoords) {
        // remove lastmove indicator from previous lastmoves
        for (const fcoord of this.#lastMoves) {
            this.draw(this.deepen(fcoord),this.state[fcoord],1);
            this.#lastMoves.delete(fcoord);
        }

        if (typeof fcoords === 'number') {
            fcoords = [fcoords];
        } else if (!fcoords) return;

        for (const fcoord of fcoords) {
            this.drawLastMoveMarker(fcoord);
            this.#lastMoves.add(fcoord);
        }
    }

    get lastMoves () {
        return this.#lastMoves;
    }

    resetLastMoveMarkers () {
        for (const fcoord of this.#lastMoves) {
            this.drawLastMoveMarker(fcoord);
        }
    }

    /**
     * Flattens 2-d coordinates to a single number
     * @param {[number,number]} coordinate
     * @returns {number} flattened coordinate
     */
    flatten ([x,y]) {
        return x + y * this.#width;
    }
    
    /**
     * Unflattens coordinate
     * @param {number} fCoord flattened coordinate
     * @returns {[number,number]} Unflattened 2-d coordinate
     */
    deepen (fCoord) {
        return [fCoord % this.#width, Math.floor(fCoord / this.#width)];
    }

    get width () {
        return this.#width;
    }

    get height () {
        return this.#height;
    }

    /**
     * @returns {number[]} Current state as displayed visually
     */
    get state () {
        return this.#state;
    }

    /**
     * Compares current state to given GameEngine state, 
     * draws changed intersections on canvas
     * @param {number[]} newState New board state
     */
    set state (newState) {
        for (let i=0; i < this.#state.length; i++) {
            if (this.#state[i] !== newState[i]) {
                this.draw(this.deepen(i), newState[i], this.#state[i]);
                this.#state[i] = newState[i];
            }
        }
    }

    /**
     * Draws stone on this.stones canvas
     * @param {number} x Horizontal 0-index grid coordinate
     * @param {number} y Vertical 0-index grid coordinate
     * @param {number} color Index of color at this.colors.player
     * @param {number} opacity Value from 0 to 1
     */
    drawStone(x,y,color,opacity=1) {
        this.stones.globalAlpha = opacity;
        this.stones.fillStyle = this.colors.player[color];

        this.stones.beginPath();
        this.stones.arc(
            this.lineSpace*(x+this.leftPadding+.5),
            this.lineSpace*(y+this.topPadding+.5),
            (this.lineSpace/2)-0.5, 0, Math.PI*2
        );
        this.stones.fill();
    }

    /**
     * Clears intersection on this.stones
     * @param {number} x Horizontal 0-index grid coordinate
     * @param {number} y Vertical 0-index grid coordinate
     */
    clearIntersection (x,y,targetCanvasContext) {
        targetCanvasContext.clearRect(
            this.lineSpace*(x+this.leftPadding),
            this.lineSpace*(y+this.topPadding),
            this.lineSpace,this.lineSpace
        );
    }

    /**
     * Draws intersection from source canvas onto display canvas
     * @param {number} x Horizontal 0-index grid coordinate
     * @param {number} y Vertical 0-index grid coordinate
     * @param {HTMLCanvasElement} sourceCanvas 
     */
    updateDomCanvas (x,y,sourceCanvas) {
        this.domCanvas.drawImage(
            sourceCanvas,
            this.lineSpace*(x+this.leftPadding),
            this.lineSpace*(y+this.topPadding),
            this.lineSpace,this.lineSpace,
            // target placement
            this.lineSpace*(x+this.leftPadding),
            this.lineSpace*(y+this.topPadding),
            this.lineSpace,this.lineSpace
        );
    }

    /**
     * Updates this.stones at intersection
     * @param {[number,number]} param0 [x,y] goban intersection 
     * @param {number} state New state of intersection
     * @param {number} lastState Previous state of intersection
     */
    draw ([x,y], state, lastState, opacity=1) {
        if (lastState) {
            this.clearIntersection(x,y,this.stones);
            this.updateDomCanvas(x,y,this.goban.canvas);
        }
        if (state) {
            this.drawStone(x,y,state,opacity);
            this.updateDomCanvas(x,y,this.stones.canvas);
        } 
    }

    /**
     * Redraws this.stones canvas and pastes it onto domCanvas
     */
    reDrawState () {
        this.stones.clearRect(0,0,this.pixelWidth,this.pixelHeight);
        for (let i=0; i < this.state.length; i++) {
            if (this.state[i]) {
                const [x,y] = this.deepen(i);
                this.drawStone(x,y,this.state[i]);
            }
        }
        this.domCanvas.drawImage(this.stones.canvas,0,0);
    }

    initDomElements() {
        ['domCanvas','goban','stones','annotations'].forEach(key => {
            this[key] = document.createElement('canvas').getContext('2d');
        });

        this.domElement = this.domCanvas.canvas;
        this.domElement.classList.add('goban-dom-element');
    }

    setCanvasSize () {
        const box = this.domElement.parentElement.getBoundingClientRect();
        // space between lines on goban
        this.lineSpace = Math.min(
            (box.bottom-box.top)/(this.totalHeight),
            (box.right-box.left)/(this.totalWidth)
        );
        // width, height of canvases in pixels
        this.pixelWidth = this.lineSpace * (this.totalWidth);
        this.pixelHeight = this.lineSpace * (this.totalHeight);
        this.fontSize = this.lineSpace >= 12 ? this.lineSpace - 4 : this.lineSpace;

        this.domElement.style.setProperty('width', `${this.pixelWidth}px`);
        this.domElement.style.setProperty('height', `${this.pixelHeight}px`);

        [this.domCanvas,this.goban,this.stones,this.annotations].forEach(ctx => {
            ctx.canvas.width = this.pixelWidth;
            ctx.canvas.height = this.pixelHeight;
        });
    }

    /**
     * Draws this.goban background and pastes it onto this.domElement
     */
    initGoban () {
        // fill goban background color
        this.goban.fillStyle = this.colors.wood;
        this.goban.fillRect(0,0,this.pixelWidth,this.pixelHeight);
        // draw grid's thicker outer rectangle
        this.goban.strokeStyle = this.colors.line;
        this.goban.lineWidth = Math.max(this.lineSpace/13, 1.5);
        this.goban.strokeRect(
            this.lineSpace * (this.leftPadding+.5), 
            this.lineSpace * (this.topPadding+.5),
            this.lineSpace * (this.width-1), this.lineSpace * (this.height-1)
        );
        // draw grid
        this.goban.lineWidth = Math.max(this.lineSpace/25, .75);
        this.goban.beginPath();
        for (let y=1; y < this.height-1; y++) {
            // horizontal lines
            this.goban.moveTo(
                this.lineSpace*(this.leftPadding+.5),
                this.lineSpace*(y+this.topPadding+.5)
            );
            this.goban.lineTo(
                this.lineSpace*(this.width+this.leftPadding-0.5),
                this.lineSpace*(y+this.topPadding+.5)
            );
        }
        for (let x=1; x < this.width-1; x++) {
            // vertical lines
            this.goban.moveTo(
                this.lineSpace*(x+this.leftPadding+.5),
                this.lineSpace*(this.topPadding+.5)
            );
            this.goban.lineTo(
                this.lineSpace*(x+this.leftPadding+.5),
                this.lineSpace*(this.height+this.topPadding-0.5)
            );
        }
        this.goban.stroke();
        // draw stars
        this.goban.fillStyle = this.colors.line;
        starPoints(this.width,this.height).forEach(star => {
            this.goban.beginPath();
            const [x,y] = this.deepen(star);
            this.goban.arc(
                this.lineSpace*(x+this.leftPadding+.5),
                this.lineSpace*(y+this.topPadding+.5),
                this.lineSpace/7.6, 0, Math.PI*2
            );
            this.goban.fill();
        });
        // draw coordinates
        this.goban.font = `${this.fontSize}px ${this.fontFamily}`;
        this.goban.textAlign = 'center';
        this.goban.textBaseline = 'middle';
        for (let i=0; i < this.width; i++) {
            // draw x-coordinates
            if (this.topPadding) {
                this.goban.fillText(
                    this.coords[0][i],
                    this.lineSpace*(i+this.leftPadding+.5),
                    this.lineSpace*.5
                );
            }
            if (this.bottomPadding) {
                this.goban.fillText(
                    this.coords[0][i],
                    this.lineSpace*(i+this.leftPadding+.5),
                    this.lineSpace*(this.height+this.topPadding+.5)
                );
            }

        }
        for (let i=0; i < this.height; i++) {
            // draw y-coordinates
            if (this.leftPadding) {
                this.goban.fillText(
                    this.coords[1][i],
                    this.lineSpace*.5,
                    this.lineSpace*(i+this.topPadding+.5)
                );
            }
            if (this.rightPadding) {
                this.goban.fillText(
                    this.coords[1][i],
                    this.lineSpace*(this.width+this.leftPadding+.5),
                    this.lineSpace*(i+this.topPadding+.5)
                );
            }
        }

        this.domCanvas.drawImage(this.goban.canvas,0,0);
    }

    update () {
        this.setCanvasSize();
        this.initGoban();
        this.reDrawState();
        this.resetLastMoveMarkers();

    }
}

export default GobanViewer;