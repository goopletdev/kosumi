//not yet in use. remove these things from KosumiGoban first

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

        this.panel.append(
            this.skipBackwardButton,
            this.stepBackwardButton,
            this.stepForewardButton,
            this.skipForewardButton
        )
    }
}