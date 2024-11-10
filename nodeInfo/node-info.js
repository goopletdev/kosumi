import { propertyDefinitions } from "../sgf/sgfProperties.js";
import StoneWalker from "../stoneWalker/stone-walker.js";

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

    /**
     * 
     * @param {StoneWalker} walker 
     */
    updateInfo(walker) {
        this.nodeProperties.innerText = `(node ${walker.root.id}) Move ${walker.root.moveNumber}:\n`;
        for (let key of Object.keys(walker.root.props)) {
            if (walker.root.id === 0 && ['root','game-info'].includes(propertyDefinitions[key].type)) {
                continue;
            }
            if (Object.keys(propertyDefinitions).includes(key)) {
                this.nodeProperties.innerText += `${key} ${propertyDefinitions[key].name}: ${walker.root.props[key]}\n`;
            } else {
                this.nodeProperties.innerText += `${key}: ${walker.root.props[key]}\n`
            }
        }
    }

    /**
     * 
     * @param {StoneWalker} walker 
     */
    updateGameInfo(walker) {
        let nodeProps = walker.root.props;
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

    /**
     * 
     * @param {StoneWalker} walker 
     */
    updateRootInfo(walker) {
        let nodeProps = walker.root.props;
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

    /**
     * 
     * @param {StoneWalker} walker 
     */
    updateInfoPanel(walker) {
        this.updateInfo(walker);
        this.updateGameInfo(walker);
        this.updateRootInfo(walker);
    }

}

export default KosumiNodeInfo;