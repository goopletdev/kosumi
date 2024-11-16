import SGF from '../sgf/sgf.js';
import * as lazy from '../lazy-dom.js';

class GobanCanvas {
    constructor(parent) {
        this.parent = parent;

        this.container = lazy.div('gobanContainer',this.parent);
        this.display = lazy.canvas('gobanCanvas',this.container,'kosumiCanvas');
        lazy.listen(this.display,'mousedown',(e) => this.onclick(e));

        this.setCanvasSize();
        this.context = this.display.getContext('2d');
        this.woodColor = 'burlywood';
        this.lineColor = 'black';
        this.blackColor = 'black';
        this.whiteColor = 'white';
        this.backgroundColor = '#deb7ff';
        this.fillCanvas();
    }

    onclick(event) {
        console.log(this.mouseLocation(event.offsetX,event.offsetY));
    }

    mouseLocation(offsetX,offsetY) {
        let x = Math.round(offsetX / this.lineSpacing - 1.5);
        let y = Math.round(offsetY / this.lineSpacing - 1.5);
        return [x,y]
    }

    setCanvasSize(columns=19,rows=19) {
        let parentBounds = this.parent.getBoundingClientRect();
        let parentHeight = parentBounds.bottom-parentBounds.top;
        let parentWidth = parentBounds.right-parentBounds.left;
        let length = parentHeight < parentWidth ? `${parentHeight}px` : `${parentWidth}px`;
        this.container.style.height = length;
        this.container.style.width = length;

        this.columns = columns;
        this.rows = rows;
        this.lineSpacing = this.display

        this.bounds = this.container.getBoundingClientRect();
        let heightSpacing = (this.bounds.bottom-this.bounds.top)/(rows+2);
        let widthSpacing = (this.bounds.right-this.bounds.left)/(columns+2);
        this.lineSpacing = heightSpacing < widthSpacing ? heightSpacing : widthSpacing;

        this.display.width = this.lineSpacing * (columns + 2);
        this.display.height = this.lineSpacing * (rows + 2);
    }

    setCanvasUnits(columns,rows) {
        this.columns = columns;
        this.rows = rows;
        this.lineSpacing = this.display.width/(columns+2);
    }

    fillCanvas() {
        this.context.fillStyle = this.woodColor;
        this.context.fillRect(0,0,this.display.width,this.display.height);
    }

    drawBoundingRectangle() {
        this.context.strokeStyle = this.lineColor;
        this.context.lineWidth = 2;
        this.context.strokeRect(
            this.lineSpacing*1.5,
            this.lineSpacing*1.5,
            this.lineSpacing*(this.columns-1),
            this.lineSpacing*(this.rows-1)
        );
    }

    drawGrid() {
        this.context.strokeStyle = this.lineColor;
        let width = this.lineSpacing/25;
        this.context.lineWidth = width > 1 ? width : 1;

        this.context.beginPath();
        for (let y=1; y<this.rows-1; y++) {
            this.context.moveTo(this.lineSpacing*1.5,this.lineSpacing * (y+1.5));
            this.context.lineTo(this.lineSpacing * (this.columns+0.5),this.lineSpacing * (y+1.5));
        }
        for (let x=1; x<this.columns-1; x++) {
            this.context.moveTo(this.lineSpacing*(x+1.5),this.lineSpacing*1.5);
            this.context.lineTo(this.lineSpacing*(x+1.5),this.lineSpacing*(this.rows+0.5));
        }
        this.context.stroke();
    }

    drawStars() {
        this.stars = [];
        if (this.rows === 19 && this.columns === 19) {
            this.stars = [
                [3,3],
                [3,9],
                [3,15],
                [9,3],
                [9,9],
                [9,15],
                [15,3],
                [15,9],
                [15,15],
            ];
        } else if (this.rows === 13 && this.columns === 13) {
            this.stars = [
                [3,3],
                [3,6],
                [3,9],
                [6,3],
                [6,6],
                [6,9],
                [9,3],
                [9,6],
                [9,9],
            ];
        } else if (this.rows === 9 && this.columns === 9) {
            this.stars = [
                [2,2],
                [2,6],
                [4,4],
                [6,2],
                [6,6],
            ]
        } else if (this.rows % 2 && this.columns % 2) {
            this.stars.push([Math.floor(this.columns/2),Math.floor(this.rows/2)]);
        }
        this.context.fillStyle = this.lineColor;
        for (let star of this.stars) {
            this.context.beginPath();
            this.context.arc(
                this.lineSpacing*(star[0]+1.5),
                this.lineSpacing*(star[1]+1.5),
                this.lineSpacing/7.6,
                0,
                Math.PI*2
            );
            this.context.fill();
        }
    }

    drawCoordinates() {
        this.fontSize = this.lineSpacing-5;
        this.context.font = `${this.fontSize}px ubuntu-condensed`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = this.lineColor;
        for (let i=0; i< this.columns; i++) {
            this.context.fillText(SGF.coordinates[i],this.lineSpacing*(i+1.5),(this.lineSpacing*.5));
            this.context.fillText(SGF.coordinates[i],this.lineSpacing*(i+1.5),this.lineSpacing*(this.rows+1.5))
        }
        for (let i=0; i< this.rows; i++) {
            this.context.fillText(SGF.coordinates[i],this.lineSpacing*.5,this.lineSpacing*(i+1.5));
            this.context.fillText(SGF.coordinates[i],this.lineSpacing*(this.columns+1.5),this.lineSpacing*(i+1.5));
        }
    }

    drawStones(boardState) {
        for (let y=0; y<this.rows; y++) {
            for (let x=0; x<this.columns; x++) {
                let newMove = boardState[y][x];
                switch (newMove.toUpperCase()) {
                    case 'W':
                        this.context.fillStyle = 'white';
                        this.context.strokeStyle = 'black';
                        break;
                    case 'B':
                        this.context.fillStyle = 'black';
                        this.context.strokeStyle = 'white';
                        break;
                    default:
                        continue;
                }
                this.context.beginPath();
                this.context.arc(this.lineSpacing*(x+1.5),this.lineSpacing*(y+1.5),(this.lineSpacing/2)-0.5,0,Math.PI*2);
                this.context.fill();

                // last move marker
                if (newMove.toLowerCase() === newMove) {
                    this.context.lineWidth = this.lineSpacing/12;
                    this.context.beginPath();
                    this.context.arc(this.lineSpacing*(x+1.5),this.lineSpacing*(y+1.5),this.lineSpacing/3.5,0,Math.PI*2);
                    this.context.stroke();
                }
            }
        }
    }

    /**
     * @param {object} walkerObject
     */
    set update(walkerObject) {
        let boardState = walkerObject.currentNode.state;
        this.setCanvasSize(boardState[0].length,boardState.length);
        this.fillCanvas();
        this.drawBoundingRectangle();
        this.drawGrid();
        this.drawStars();
        this.drawCoordinates();
        this.drawStones(boardState);
    }
}

export default GobanCanvas;