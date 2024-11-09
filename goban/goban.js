import SGF from '../sgf/sgf-handler.js';

class GobanCanvas {
    constructor(parent) {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('gobanContainer');
        this.parent.appendChild(this.container);

        this.display = document.createElement('canvas');
        this.display.id = 'kosumiCanvas';
        this.display.classList.add('gobanCanvas');
        this.container.appendChild(this.display);

        this.setCanvasSize();
        this.context = this.display.getContext('2d');
        this.woodColor = 'burlywood';
        this.lineColor = 'black';
        this.blackColor = 'black';
        this.whiteColor = 'white';
        this.backgroundColor = '#deb7ff';
        this.fillCanvas();
    }

    setCanvasSize(columns=19,rows=19) {
        this.columns = columns;
        this.rows = rows;
        this.lineSpacing = this.display

        this.bounds = this.parent.getBoundingClientRect();
        let heightSpacing = (this.bounds.bottom-this.bounds.top)/(rows+2);
        let widthSpacing = (this.bounds.right-this.bounds.left)/(columns+2);
        this.lineSpacing = heightSpacing < widthSpacing ? heightSpacing : widthSpacing;

        this.display.width = this.lineSpacing * (columns + 2);
        this.display.height = this.lineSpacing * (rows + 2);

/*
        this.bounds = this.container.getBoundingClientRect();
        const height = this.bounds.bottom-this.bounds.top;
        const width = this.bounds.right-this.bounds.left;
        this.display.width = width < height? height : width;
        this.display.height = this.display.width;*/
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
        this.context.strokeRect(this.lineSpacing*1.5,this.lineSpacing*1.5,this.lineSpacing*(this.columns-1),this.lineSpacing*(this.rows-1));
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
            this.context.arc(this.lineSpacing*(star[0]+1.5),this.lineSpacing*(star[1]+1.5),this.lineSpacing/7.6,0,Math.PI*2);
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

    updateCanvas(boardState) {
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