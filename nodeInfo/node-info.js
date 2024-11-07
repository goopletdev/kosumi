import { propertyDefinitions } from "../sgfStuff/sgfProperties.js";
import StoneWalker from "../stone-walker.js";

class KosumiNodeInfo {
    constructor(parent) {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.classList.add('kosumiNodeInfo');
        this.parent.appendChild(this.container);
        
        this.rootProperties = document.createElement('div');
        this.rootProperties.classList.add('kosumiNodeInfoRoot');
        this.container.appendChild(this.rootProperties);

        this.gameInfoProperties = document.createElement('div');
        this.gameInfoProperties.classList.add('kosumiNodeInfoGameInfo');
        this.container.appendChild(this.gameInfoProperties);

        this.nodeProperties = document.createElement('div');
        this.nodeProperties.classList.add('kosumiNodeInfoOther');
        this.container.appendChild(this.nodeProperties);

        this.gameInfo = [];
    }

    updateInfo(node) {
        this.nodeProperties.innerText = `(node ${node.id}) Move ${node.moveNumber}:\n`;
        for (let key of Object.keys(node.props)) {
            if (node.id === 0 && ['root','game-info'].includes(propertyDefinitions[key].type)) {
                continue;
            }
            if (Object.keys(propertyDefinitions).includes(key)) {
                this.nodeProperties.innerText += `${key} ${propertyDefinitions[key].name}: ${node.props[key]}\n`;
            } else {
                this.nodeProperties.innerText += `${key}: ${node.props[key]}\n`
            }
        }
    }

    updateGameInfo(node) {
        let nodeProps = StoneWalker.getRootNode(node).props;
        let gameInfoProperties = '';
        for (let key of Object.keys(nodeProps)) {
            if (propertyDefinitions.hasOwnProperty(key)) {
                if (propertyDefinitions[key].type !== 'game-info') {
                    continue;
                }
                gameInfoProperties += `${key} ${propertyDefinitions[key].name}: ${nodeProps[key]}\n`
            }
        }
        this.gameInfoProperties.innerText = gameInfoProperties;
    }

    updateRootInfo(node) {
        let nodeProps = StoneWalker.getRootNode(node).props;
        let rootProperties = '';
        for (let key of ['FF','GM','AP','CA','ST','SZ']) {
            let propertyValue;
            if (nodeProps.hasOwnProperty(key)) {
                propertyValue = nodeProps[key];
            } else {
                propertyValue = propertyDefinitions[key].kosumiDefault;
            }
            rootProperties += `${key} ${propertyDefinitions[key].name}: ${propertyValue}\n`;
        }
        this.rootProperties.innerText = rootProperties;
    }

    updateInfoPanel(node) {
        this.updateInfo(node);
        this.updateGameInfo(node);
        this.updateRootInfo(node);
    }

}

export default KosumiNodeInfo;