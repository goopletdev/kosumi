/**
 * @module SGF
 */
import { stringify } from "./encode-sgf.js";
import { tokenize, parseTokens, buildGameObject } from "./parse-sgf.js";

class SGF {
    /**
     * Encodes a game object as an SGF string
     * @param {object} node Root node of game tree
     * @returns {string} SGF string
     */
    static stringify = stringify;

    /**
     * Uses SGF.stringify on each game object in an array and joins them
     * @param {object[]} games 
     * @returns {string} SGF collection 
     */
    static encodeCollection = (games) => games.map(stringify).join('\n\n');

    /**
     * Returns array of Game objects from an SGF
     * @param {string} sgf SGF/SGF collection string
     * @returns {object[]} Array of game node trees
     */
    static parse(sgf) {
        let gameTree;
        tokenize(sgf, tokens => {
            parseTokens(tokens, nodes => {
                gameTree = buildGameObject(nodes);
            })
        })
        return gameTree;
    }
}

export default SGF;