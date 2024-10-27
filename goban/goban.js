const sgfCoordinates = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
        } else {
            this.boardState = document.createElement('pre');
            this.boardState.classList.add('gobanBoardState');
            this.boardState.innerText = KosumiGoban.placeholder;
            this.container.appendChild(this.boardState);
        }

        this.navigation = document.createElement('div');
        this.navigation.classList.add('gobanNavigationPanel');
        this.container.appendChild(this.navigation);

        this.skipBackwardButton = document.createElement('button');
        this.stepBackwardButton = document.createElement('button');
        this.stepForewardButton = document.createElement('button');
        this.skipForewardButton = document.createElement('button');
        this.skipBackwardButton.innerHTML = '<i class="fa fa-fast-backward"></i>'
        this.stepBackwardButton.innerHTML = '<i class="fa fa-step-backward"></i>'
        this.stepForewardButton.innerHTML = '<i class="fa fa-step-forward"></i>'
        this.skipForewardButton.innerHTML = '<i class="fa fa-fast-forward"></i>'
        this.skipBackwardButton.classList.add('gobanNavigationButton');
        this.stepBackwardButton.classList.add('gobanNavigationButton');
        this.stepForewardButton.classList.add('gobanNavigationButton');
        this.skipForewardButton.classList.add('gobanNavigationButton');
        const object = this;
        this.skipBackwardButton.addEventListener('click',function() {
            object.skipBackward()
        });
        this.stepBackwardButton.addEventListener('click',function() {
            object.stepBackward()
        });
        this.stepForewardButton.addEventListener('click',function() {
            object.stepForeward()
        });
        this.skipForewardButton.addEventListener('click',function() {
            object.skipForeward()
        });

        this.navigation.append(
            this.skipBackwardButton,
            this.stepBackwardButton,
            this.stepForewardButton,
            this.skipForewardButton
        )

        this.info = document.createElement('textarea');
        this.info.classList.add('gobanInfo');
        this.container.appendChild(this.info);

        this.activeNode;
        this.gameTree;
        this.getNodeById;
        this.getState;
        this.getLastMainNode; 
    }

    skipBackward() {
        this.activeNode = this.gameTree;
        if (this.displayStyle === 'html') {
            this.boardState.innerHTML = KosumiGoban.asciiHTML(this.activeNode.state);
        } else if (this.displayStyle === 'ascii') {
            this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
        } else if (this.displayStyle === 'canvas') {
            KosumiGoban.paint(this.boardState,this.activeNode.state);
        }
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }

    stepBackward() {
        if (this.activeNode.hasOwnProperty('parent')) {
            this.activeNode = this.getNodeById(this.gameTree,this.activeNode.parent);
            if (this.displayStyle === 'html') {
                this.boardState.innerHTML = KosumiGoban.asciiHTML(this.activeNode.state);
            } else if (this.displayStyle === 'ascii') {
                this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
            } else if (this.displayStyle === 'canvas') {
                KosumiGoban.paint(this.boardState,this.activeNode.state);
            }  
        }
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }
    
    stepForeward() {
        if (this.activeNode.hasOwnProperty('children')) {
            let newState = this.getState(this.activeNode.state, this.activeNode.children[0].props);
            this.activeNode = this.activeNode.children[0];
            this.activeNode.state = newState;
            if (this.displayStyle === 'html') {
                this.boardState.innerHTML = KosumiGoban.asciiHTML(this.activeNode.state);
            } else if (this.displayStyle === 'ascii') {
                this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
            } else if (this.displayStyle === 'canvas') {
                KosumiGoban.paint(this.boardState,this.activeNode.state);
            }    
        }
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }

    skipForeward() {
        this.activeNode = this.getLastMainNode(this.activeNode);
        if (this.displayStyle === 'html') {
            this.boardState.innerHTML = KosumiGoban.asciiHTML(this.activeNode.state);
        } else if (this.displayStyle === 'ascii') {
            this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
        } else if (this.displayStyle === 'canvas') {
            KosumiGoban.paint(this.boardState,this.activeNode.state);
        } 
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }
        
    static ascii(goban) {
        let state = JSON.parse(JSON.stringify(goban));
        let Y = state.length;
        let X = state[0].length;
        let stars = [];
        if (Y === 19 && X === 19) {
            stars = [3,9,15];
        } 
        let pretty = '//' + Array.from(sgfCoordinates.slice(0,X)).join(' ') + '\\\\\n';
        let b = 'X'; //●
        let w = 'O'; //○
        let lastB = 'X̂'
        let lastW = 'ʘ'

        for (let y = 0; y < state.length; y++) {
            let emptyFirst = '┠';
            let emptyMid = '─';
            let emptyPoint = '┼'
            let emptyLast = '┨';
            if (y === 0) {
                emptyFirst = '┏';
                emptyMid = '━';
                emptyPoint = '┯';
                emptyLast = '┓';
            } else if (y === state.length-1) {
                emptyFirst = '┗';
                emptyMid = '━';
                emptyPoint = '┷';
                emptyLast = '┛';
            }
            if (stars.includes(y)) {
                for (let j of stars) {
                    if (state[y][j] === '.') {
                        state[y][j] = '╋'//╋╬
                    } 
                }
            }
            if (state[y][0] === '.') {
                state[y][0] = emptyFirst;
            }
            if (state[y][X-1] === '.') {
                state[y][X-1] = emptyLast;
            }
            let row = state[y]
            .join(emptyMid).replaceAll('.',emptyPoint)
            .replaceAll('B',b).replaceAll('W',w)
            .replaceAll('b',lastB).replaceAll('w',lastW);
            pretty += `${sgfCoordinates[y]} ${row} ${sgfCoordinates[y]}\n`;
        }
        let toPlay = '▪▫';
        if (pretty.includes(lastW)) {
            toPlay = '▫▪'
        }
        pretty += toPlay + Array.from(sgfCoordinates.slice(0,X)).join(' ') + '//';
        return pretty;
    }

    static asciiHTML(goban) {
        let state = JSON.parse(JSON.stringify(goban));
        let Y = state.length;
        let X = state[0].length;
        let stars = [];
        if (Y === 19 && X === 19) {
            stars = [3,9,15];
        } 
        let pretty = '<code class="gobanPointEmpty">  </code>' + Array.from(sgfCoordinates.slice(0,X)).join(' ') + '<code class="gobanPointEmpty">  </code>\n';
        let b = '<code class="gobanPointBlack">@</code>'; 
        let w = '<code class="gobanPointWhite">@</code>'; 
        let lastB = '<code class="gobanPointBlack">#</code>'
        let lastW = '<code class="gobanPointWhite">#</code>'

        for (let y = 0; y < state.length; y++) {
            let emptyFirst = '┠';
            let emptyMid = '─';
            let emptyPoint = '┼'
            let emptyLast = '┨';
            if (y === 0) {
                emptyFirst = '┏';
                emptyMid = '━';
                emptyPoint = '┯';
                emptyLast = '┓';
            } else if (y === state.length-1) {
                emptyFirst = '┗';
                emptyMid = '━';
                emptyPoint = '┷';
                emptyLast = '┛';
            }
            if (stars.includes(y)) {
                for (let j of stars) {
                    if (state[y][j] === '.') {
                        state[y][j] = '╋'//╋╬
                    } 
                }
            }
            if (state[y][0] === '.') {
                state[y][0] = emptyFirst;
            }
            if (state[y][X-1] === '.') {
                state[y][X-1] = emptyLast;
            }
            let row = state[y].map((coord) => {
                switch (coord) {
                    case 'B':
                        return b;
                    case 'W':
                        return w;
                    case 'b':
                        return lastB;
                    case 'w':
                        return lastW;
                    case '.':
                        return emptyPoint;
                    default:
                        return coord;
                }
            }).join(emptyMid);
            pretty += `${sgfCoordinates[y]} ${row} ${sgfCoordinates[y]}\n`;
        }
        let toPlay = '▪▫';
        if (pretty.includes(lastW)) {
            toPlay = '▫▪'
        }
        pretty += toPlay + Array.from(sgfCoordinates.slice(0,X)).join(' ') + '  ';
        return pretty;
    }

    static paint(canvas, boardState) {
        let width = boardState[0].length;
        let height= boardState.length;

        let widthUnit = Math.floor(canvas.width / (width + 2));
        let heightUnit = Math.floor(canvas.height / (height + 2));
        console.log(widthUnit,heightUnit, (canvas.width))
        
        console.log('paint on!');
        if (canvas.getContext) {
            const context = canvas.getContext('2d');

            context.fillStyle = 'burlywood';
            context.fillRect(0,0,canvas.width,canvas.height);

            for (let y=0; y<height; y++) {
                if (y===0 || y===height-1) {
                    context.lineWidth = 2;
                } else {
                    context.lineWidth = 1;
                }
                context.strokeStyle = 'black';
                context.beginPath()
                context.moveTo(widthUnit*1.5,heightUnit * (y+1.5));
                context.lineTo(widthUnit * (width+0.5),heightUnit * (y+1.5));
                context.stroke();
            }
            for (let x=0; x<width; x++) {
                if (x===0 || x===height-1) {
                    context.lineWidth = 2;
                } else {
                    context.lineWidth = 1;
                }
                context.strokeStyle = 'black';
                context.beginPath()
                context.moveTo(widthUnit*(x+1.5),heightUnit*1.5);
                context.lineTo(widthUnit*(x+1.5),heightUnit*(height+0.5));
                context.stroke();
            }
            // star points 
            if (height === 19 && width === 19) {
                context.fillStyle = 'black';
                let stars = [
                    [3,3],
                    [3,9],
                    [3,15],
                    [9,3],
                    [9,9],
                    [9,15],
                    [15,3],
                    [15,9],
                    [15,15]
                ];
                for (let star of stars) {
                    context.beginPath();
                    context.arc(widthUnit*(star[0]+1.5),heightUnit*(star[1]+1.5),2.5,0,Math.PI*2);
                    context.fill();
                }
            }
            // coords
            context.font = '14px monospace'
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            for (let i=0; i< width; i++) {
                context.fillText(sgfCoordinates[i],widthUnit*(i+1.5),(heightUnit*.5));
                context.fillText(sgfCoordinates[i],widthUnit*(i+1.5),heightUnit*(height+1.5))
            }
            for (let i=0; i< height; i++) {
                context.fillText(sgfCoordinates[i],widthUnit*.5,heightUnit*(i+1.5));
                context.fillText(sgfCoordinates[i],widthUnit*(height+1.5),heightUnit*(i+1.5));
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
                    context.arc(widthUnit*(x+1.5),heightUnit*(y+1.5),8,0,Math.PI*2);
                    context.fill();
                    if (newMove.toLowerCase() === newMove) {
                        context.lineWidth = 1.5;
                        context.beginPath();
                        context.arc(widthUnit*(x+1.5),heightUnit*(y+1.5),5,0,Math.PI*2);
                        context.stroke();
                    }
                }
            }
        }
    }

    static placeholder = `  a b c d e f g h i j k l m n o p q r s  
    a ┏━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┯━┓ a
    b ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ b
    c ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ c
    d ┠─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┨ d
    e ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ e
    f ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ f
    g ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ g
    h ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ h
    i ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ i
    j ┠─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┨ j
    k ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ k
    l ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ l
    m ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ m
    n ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ n
    o ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ o
    p ┠─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┼─┼─┼─╋─┼─┼─┨ p
    q ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ q
    r ┠─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┨ r
    s ┗━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┷━┛ s
    ▪▫a b c d e f g h i j k l m n o p q r s  `

}

//need to define getNodeById() and ascii(); and gameTree; get ride of getState() since this should only reference a fully-formed node tree


export default KosumiGoban;