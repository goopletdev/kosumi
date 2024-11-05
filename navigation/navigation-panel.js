class KosumiNavigation {
    constructor (parent) {
        this.parent = parent;

        this.panel = document.createElement('div');
        this.panel.classList.add('kosumiNavigationPanel');
        this.parent.appendChild(this.panel);

        this.skipBackwardButton = document.createElement('button');
        this.stepBackwardButton = document.createElement('button');
        this.stepForewardButton = document.createElement('button');
        this.skipForewardButton = document.createElement('button');
        this.skipBackwardButton.innerHTML = '<i class="fa fa-fast-backward"></i>'
        this.stepBackwardButton.innerHTML = '<i class="fa fa-step-backward"></i>'
        this.stepForewardButton.innerHTML = '<i class="fa fa-step-forward"></i>'
        this.skipForewardButton.innerHTML = '<i class="fa fa-fast-forward"></i>'
        this.skipBackwardButton.classList.add('kosumiNavigationButton');
        this.stepBackwardButton.classList.add('kosumiNavigationButton');
        this.stepForewardButton.classList.add('kosumiNavigationButton');
        this.skipForewardButton.classList.add('kosumiNavigationButton');
        let that = this;
        this.skipBackwardButton.addEventListener('click',function() {
            while(that.activeNode.hasOwnProperty('parent')) {
                that.activeNode = that.activeNode.parent;
            };
            that.update();
        });
        this.stepBackwardButton.addEventListener('click',function() {
            if (that.activeNode.hasOwnProperty('parent')) {
                that.activeNode = that.activeNode.parent;
                that.update();
            }
        });
        this.stepForewardButton.addEventListener('click',function() {
            if (that.activeNode.hasOwnProperty('children')) {
                that.activeNode = that.activeNode.children[0];
                that.update();
            }
        });
        this.skipForewardButton.addEventListener('click',function() {
            while (that.activeNode.hasOwnProperty('children')) {
                that.activeNode = that.activeNode.children[0];
                that.update();
            }
        })

        this.panel.append(
            this.skipBackwardButton,
            this.stepBackwardButton,
            this.stepForewardButton,
            this.skipForewardButton
        )

        this.info = document.createElement('textarea');
        this.info.classList.add('gobanInfo');
        this.parent.appendChild(this.info);

        this.activeNode;
    }

    setGoban(kosumiGobanObject) {
        this.goban = kosumiGobanObject; 
    }

    update() {
        this.goban.updateCanvas(this.activeNode.state);
        this.info.value = `(node ${this.activeNode.id}) Move ${this.activeNode.moveNumber}:\n${JSON.stringify(this.activeNode.props)}`;
    }


}

export default KosumiNavigation;