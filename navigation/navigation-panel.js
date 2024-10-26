//not yet in use. remove these things from KosumiGoban first

class KosumiNavigation {
    constructor (parent) {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('navigationPanelContainer');
        this.parent.appendChild(this.container);

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

        this.navigation.append(
            this.skipBackwardButton,
            this.stepBackwardButton,
            this.stepForewardButton,
            this.skipForewardButton
        )
    }
}