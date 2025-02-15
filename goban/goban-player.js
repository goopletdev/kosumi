class GobanPlayer {
    constructor (gobanDisplay,engine) {
        this.viewer = gobanDisplay;
        this.engine = engine;

        this.numberPlayers = 2;
        this.activePlayer = 1;
        this.mouseOverTool = 1;

        this.tool = this.play;
        this.shiftKey = false;

        this.listen();
    }

    /**
     * Finds next player in turn order after given color
     * @param {number} color 
     * @returns {number}
     */
    nextPlayer (color = this.activePlayer) {
        return color % this.numberPlayers + 1;
    }

    /**
     * Sets this.cursor, draws semiopaque mouseover stone
     * @param {mouseMove} e mousemove event
     */
    mouseMove (e) {
        // calculate x,y goban grid coordinates from offsetX and offsetY
        const x = Math.round(e.offsetX / this.viewer.lineSpace - this.viewer.leftPadding - .5);
        const y = Math.round(e.offsetY / this.viewer.lineSpace - this.viewer.topPadding - .5);
        
        let color = this.mouseOverTool;
        if (this.toolType === 'place' && this.shiftKey) {
            color = this.nextPlayer(color);
        }
        if (this.cursor?.[0] === x && this.cursor[1] === y) {
            // cursor is not over a new intersection
            return;
        }
        if (this.cursor && !this.viewer.state[this.viewer.flatten(this.cursor)]) {
            // remove previous mouseover stone
            this.viewer.draw(this.cursor,0,1);
        }
        if (x < 0 || y < 0 || x > this.viewer.width-1 || y > this.viewer.height-1) {
            // new cursor location is not on grid
            this.cursor = null;
            return;
        }
        if (!this.viewer.state[this.viewer.flatten([x,y])]) {
            // draw mouseover stone
            this.viewer.draw([x,y],color,0,0.5);
        }
        this.cursor = [x,y];
    }

    /**
     * sets initial click position
     * @param {mouseDown} e mousedown event
     */
    mouseDown (e) {
        if (e.button || !this.cursor) return; // (should only work for left click)
        const [x,y] = this.cursor;
        if (x < 0 || y < 0 || x > this.viewer.width-1 || y > this.viewer.height-1) {
            // cursor is out of range
            return;
        }
        this.clickPosition = [x,y];
    }

    /**
     * MouseUp event handler; executes click action
     * @param {mouseUp} e mouseup event
     */
    mouseUp (e) { 
        if (e.button || !this.cursor) return; // (only for left click)
        const [x,y] = this.cursor;
        if (x < 0 || y < 0 || x > this.viewer.width-1 || y > this.viewer.height-1) {
            // cursor is out of range
            this.clickPosition = [null,null];
        } else if (this.clickPosition[0] === x && this.clickPosition[1] === y) {
            // mouse didn't move; execute simple click
            console.log(this.clickPosition);
            this.tool(x,y);
        } else {
            // click and drag
            console.log(this.clickPosition[0],this.clickPosition[1],'=>',x,y);
        }
        // reset click position
        this.clickPosition = [null,null];
    }

    play (x,y) {
        this.engine.move(this.activePlayer, this.engine.flatten([x,y]));
        this.activePlayer = this.nextPlayer();
        this.viewer.state = this.engine.state;
        this.mouseOverTool = this.activePlayer;
        this.viewer.lastMoves = [this.viewer.flatten([x,y])]
    }

    /**
     * Returns function for placing stone of given color
     * @param {*} color 
     * @returns {function}
     */
    place (color) {
        const placementColor = color;
        const alt = this.nextPlayer(placementColor);

        /**
         * For setting up a position; 
         * does not execute captures or change player color
         * @param {number} x 0-index goban column
         * @param {number} y 0-index goban row
         */
        return (x,y) => {
            const flat = this.engine.flatten([x,y]);
            const targetColor = this.shiftKey ? alt : placementColor;
            this.engine.setup(targetColor,flat);
            this.viewer.state = this.engine.state;
            // remove last move markers
            this.viewer.lastMoves = [];
        }
    }

    listen () {
        this.viewer.domElement.addEventListener('mousedown', e => this.mouseDown(e));
        this.viewer.domElement.addEventListener('mouseup', e => this.mouseUp(e));
        this.viewer.domElement.addEventListener('mousemove', e => this.mouseMove(e));
        this.viewer.domElement.addEventListener('mouseleave', e => this.mouseMove(e));

        document.defaultView.addEventListener('keydown', e => {
            if (e.key === 'Shift' && this.shiftKey === false) {
                this.shiftKey = true;

                if (!this.cursor) return;
                const fcoord = this.viewer.flatten(this.cursor);
                if (this.toolType === 'place' && !this.viewer.state[fcoord]) {
                    this.viewer.draw(this.cursor,this.nextPlayer(this.mouseOverTool),1,0.5);
                }
            } 
        });

        document.addEventListener('keyup', e => {
            if (e.key === 'Shift') {
                this.shiftKey = false;

                if (!this.cursor) return;
                const fcoord = this.viewer.flatten(this.cursor);
                if (this.toolType === 'place' && !this.viewer.state[fcoord]) {
                    this.viewer.draw(this.cursor,this.mouseOverTool,1,0.5);
                }
            }
        });
    }

    set toolPanel (element) {
        this.panel = document.createElement('div');
        element.append(this.panel);
        this.tools = { play: document.createElement('button') };
        this.tools.play.addEventListener('click', () => {
            this.tool = this.play;
            this.toolType = 'play';
            this.mouseOverTool = this.activePlayer;
        });
        this.tools.play.textContent = 'Play';

        for (let i=1; i <= this.numberPlayers; i++) {
            const btn = document.createElement('button');
            this.tools[`place${i}`] = btn;
            btn.addEventListener('click', () => {
                this.mouseOverTool = i;
                this.toolType = 'place';
                this.tool = this.place(i)
            });
            btn.textContent = `Place ${this.viewer.colors.player[i]}`;
        }

        this.tools.coordinates = document.createElement('button');
        this.tools.coordinates.textContent = 'Coordinates';
        this.tools.coordinates.addEventListener('click', () => {
            this.viewer.coordDisplay = [
                ++this.viewer.horizontalCoords % 4,
                ++this.viewer.verticalCoords % 4
            ];
            this.viewer.update();
        })



        Object.values(this.tools).forEach(button => {
            button.classList.add('kosumiNavigationButton');
        });

        this.panel.append(...Object.values(this.tools));
    }
}

export default GobanPlayer;