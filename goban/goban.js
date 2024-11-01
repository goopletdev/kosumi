import {sgfCoordinates} from '../sgfStuff/sgfProperties.js'
//const sgfCoordinates = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

class KosumiGoban {
    constructor(parent, displayStyle = 'canvas') {
        this.displayStyle = displayStyle;
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('gobanContainer');
        this.parent.appendChild(this.container);

        if (this.displayStyle === 'canvas') {
            this.boardState = document.createElement('canvas');
            this.boardState.height = '400';
            this.boardState.width = '400';
            this.boardState.id = 'kosumiCanvas';
            this.boardState.classList.add('gobanCanvas');
            this.container.appendChild(this.boardState);

            if (this.boardState.getContext) {
                const context = this.boardState.getContext('2d');
    
                context.fillStyle = 'burlywood';
                context.fillRect(0,0,this.boardState.width,this.boardState.height);
            }
        } else {
            this.boardState = document.createElement('pre');
            this.boardState.classList.add('gobanBoardState');
            this.boardState.innerText = KosumiGoban.placeholder;
            this.container.appendChild(this.boardState);
        }
    }

    update(state) {
        if (this.displayStyle === 'html') {
            this.boardState.innerHTML = KosumiGoban.asciiHTML(state);
        } else if (this.displayStyle === 'ascii') {
            this.boardState.innerText = KosumiGoban.ascii(state);
        } else if (this.displayStyle === 'canvas') {
            KosumiGoban.paint(this.boardState, state);
        }
    }
     
    static paint(canvasElement, boardState) {
        let width = boardState[0].length;
        let height= boardState.length;

        let widthUnit = Math.floor(canvasElement.width / (width + 2));
        let heightUnit = Math.floor(canvasElement.height / (height + 2));
        let unit = widthUnit > heightUnit ? heightUnit : widthUnit;
        // normalize the vertical and horizontal distance between intersections
        canvasElement.width = (width+2) * unit;
        canvasElement.height = (height+2) * unit;
        
        if (canvasElement.getContext) { // can probably get rid of this line
            const context = canvasElement.getContext('2d');

            //context.fillStyle = 'rgb(240, 177, 95)';
            context.fillStyle = '#deb7ff';
            context.fillRect(0,0,canvasElement.width,canvasElement.height);

            context.fillStyle = 'burlywood';
            context.fillRect(unit,unit,canvasElement.width-(unit*2),canvasElement.height-(unit*2));
            for (let y=0; y<height; y++) {
                if (y===0 || y===height-1) {
                    context.lineWidth = 2;
                } else {
                    context.lineWidth = 1;
                }
                context.strokeStyle = 'black';
                context.beginPath()
                context.moveTo(unit*1.5,unit * (y+1.5));
                context.lineTo(unit * (width+0.5),unit * (y+1.5));
                context.stroke();
            }
            for (let x=0; x<width; x++) {
                if (x===0 || x===width-1) {
                    context.lineWidth = 2;
                } else {
                    context.lineWidth = 1;
                }
                context.strokeStyle = 'black';
                context.beginPath()
                context.moveTo(unit*(x+1.5),unit*1.5);
                context.lineTo(unit*(x+1.5),unit*(height+0.5));
                context.stroke();
            }
            // board markings 
            context.fillStyle = 'black';

            // star points 
            let stars = [];
            if (height === 19 && width === 19) {
                stars = [
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
            } else if (height === 13 && width === 13) {
                stars = [
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
            } else if (height === 9 && width === 9) {
                stars = [
                    [2,2],
                    [2,6],
                    [4,4],
                    [6,2],
                    [6,6],
                ]
            } else if (height % 2 && width % 2) {
                stars.push([Math.floor(width/2),Math.floor(height/2)]);
            }

            for (let star of stars) {
                context.beginPath();
                context.arc(unit*(star[0]+1.5),unit*(star[1]+1.5),unit/7.6,0,Math.PI*2);
                context.fill();
            }
            
            // coords
            let fontSize = unit-5;
            context.font = `${fontSize}px ubuntu-condensed`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            for (let i=0; i< width; i++) {
                context.fillText(sgfCoordinates[i],unit*(i+1.5),(unit*.5));
                context.fillText(sgfCoordinates[i],unit*(i+1.5),unit*(height+1.5))
            }
            for (let i=0; i< height; i++) {
                context.fillText(sgfCoordinates[i],unit*.5,unit*(i+1.5));
                context.fillText(sgfCoordinates[i],unit*(width+1.5),unit*(i+1.5));
            }
            // stones
            for (let y=0; y<height; y++) {
                for (let x=0; x<width; x++) {
                    let newMove = boardState[y][x];
                    switch (newMove.toUpperCase()) {
                        case 'W':
                            context.fillStyle = 'white';
                            context.strokeStyle = 'black';
                            break;
                        case 'B':
                            context.fillStyle = 'black';
                            context.strokeStyle = 'white';
                            break;
                        default:
                            continue;
                    }
                    context.beginPath();
                    context.arc(unit*(x+1.5),unit*(y+1.5),(unit/2)-0.5,0,Math.PI*2);
                    context.fill();

                    // last move marker
                    if (newMove.toLowerCase() === newMove) {
                        context.lineWidth = unit/12;
                        context.beginPath();
                        context.arc(unit*(x+1.5),unit*(y+1.5),unit/3.5,0,Math.PI*2);
                        context.stroke();
                    }
                }
            }
        }
    }
}

export default KosumiGoban;