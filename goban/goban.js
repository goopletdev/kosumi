const sgfCoordinates = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let placeholder = `//a b c d e f g h i j k l m n o p q r s\\
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
▪▫a b c d e f g h i j k l m n o p q r s//`

class KosumiGoban {
    constructor(parent) {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('gobanContainer');
        this.parent.appendChild(this.container);

        this.boardState = document.createElement('div');
        this.boardState.classList.add('gobanBoardState');
        this.boardState.innerText = placeholder;
        this.container.appendChild(this.boardState);

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
        this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }

    stepBackward() {
        if (this.activeNode.hasOwnProperty('parent')) {
            this.activeNode = this.getNodeById(this.gameTree,this.activeNode.parent);
            this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
        }
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }
    
    stepForeward() {
        if (this.activeNode.hasOwnProperty('children')) {
            let newState = this.getState(this.activeNode.state, this.activeNode.children[0].props);
            this.activeNode = this.activeNode.children[0];
            this.activeNode.state = newState;
            this.boardState.innerText = KosumiGoban.ascii(newState);
        }
        this.info.value = `(Node: ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }

    skipForeward() {
        this.activeNode = this.getLastMainNode(this.activeNode);
        console.log(this.activeNode);
        this.boardState.innerText = KosumiGoban.ascii(this.activeNode.state);
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

}

//need to define getNodeById() and ascii(); and gameTree; get ride of getState() since this should only reference a fully-formed node tree


export default KosumiGoban;