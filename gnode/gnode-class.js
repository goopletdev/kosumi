/**
 * @module Gnode the G is silent
 */
export default class Gnode { // the G is silent
    #children
    #parent
    /**
     * 
     * @param {object} options 
     * @param {Gnode} parent 
     * @param  {...Gnode} children 
     */
    constructor (options, parent, ...children) {
        if (options) Object.assign(this, options);
        this.#children = children;
        this.#parent = parent;
    }

    /**
     * Searches up gnode tree for parentless gnode
     * @type {Gnode}
     * @readonly
     */
    get root () {
        return this.parent?.root || this;
    }

    /**
     * @type {Array.<Gnode>}
     */
    get children () {
        return this.#children;
    }

    /**
     * @type {Gnode | undefined}
     */
    get parent () {
        return this.#parent;
    }

    /**
     * Returns array of Gnodes that share a parent, an empty array if
     * no Gnodes share a parent, or null if this does not have a parent.
     * @type {Array.<Gnode>}
     * @readonly
     */
    get siblings () {
        if (this.parent) {
            const childs = this.parent.children;
            const index = childs.indexOf(this);
            return [...childs.slice(0,index),...childs.slice(index+1)];
        } else return null;
    }

    addChilds = (...childs) => {
        childs.forEach(child => {
            if (child instanceof Gnode) this.children.push(child);
            else throw new Error(`${child} not instanceof Gnode`);
        });
        return this.children;
    }

    addChild = (child) => {
        if (child instanceof Gnode) this.children.push(child);
        else throw new Error(`${child} not instanceof Gnode`);
        return child;
    }

    /**
     * 
     */
    set mainBranch (child) {
        if (child instanceof Gnode) {
            const index = this.children.indexOf(child);
            if (index > -1) {
                this.#children = [
                    child,
                    ...this.children.slice(0,index),
                    ...this.children.slice(index+1)
                ]
            } else this.children.unshift(child);
        } else throw new Error(`${child} not instanceof Gnode`);
    }

    /**
     * @type {Gnode | undefined}
     */
    get mainBranch () {
        return this.children[0];
    }

    /**
     * Inserts a new Gnode above this in the Gnode tree,
     * replacing this with the new Gnode in this.parent.children,
     * assigning this to new Gnode.children, and assigning new Gnode
     * to this.#parent
     * @param {object | Gnode} options 
     * @returns {Gnode} New this.parent
     */
    insertAbove = (options) => {
        const node = options instanceof Gnode ? options 
            : new Gnode(options,this.parent,this);
        if (this.parent) {
            const childs = this.parent.children;
            childs[childs.indexOf(this)] = node;
        }
        this.#parent = node;
        return node;
    }

    /**
     * Inserts a new Gnode below this in Gnode tree,
     * reassigning this.children to new Gnode.#children
     * and assigning [new Gnode] to this.#children
     * @param {object | Gnode} options 
     * @returns {Gnode} New this.children[0]
     */
    insertBelow = (options) => {
        const node = options instanceof Gnode ? options
            : new Gnode(options,this,...this.children);
        this.#children = [node];
        return node;
    }

    /**
     * Searches down current branch for terminal Gnode
     * @returns {Gnode} last Gnode in current branch
     */
    terminal = () => this.children[0]?.terminal() || this;

    /**
     * Searches down all branches for first node with particular property
     * @param {string} key 
     * @param {any} value 
     * @returns {Gnode | null}
     */
    searchDown = (key, value) => {
        if (this[key] === value) return this;
        for (let child of this.children) {
            const node = child.searchDown(key,value);
            if (node) return node;
        }
        return null;
    }

    /**
     * Searches up tree for node with property
     * @param {string} key 
     * @param {any} value 
     * @returns {Gnode | null}
     */
    searchUp = (key, value) => {
        if (this[key] === value) return this;
        return this.parent?.searchUp(key,value) || null;
    }

    /**
     * Searches down tree from root node for node with property
     * @param {string} key 
     * @param {any} value 
     * @returns {Gnode | null}
     */
    searchTopDown = (key, value) => this.root.searchUp(key,value);

    /**
     * Searches down current branch for node with property
     * @param {string} key 
     * @param {any} value 
     * @returns {Gnode | null}
     */
    searchDownBranch = (key, value) => {
        if (this[key] === value) return this;
        return this.children[0]?.searchDownBranch(key,value) || null;
    }

    /**
     * Searches up branch from terminal node for node with property
     * @param {string} key 
     * @param {any} value 
     * @returns {Gnode | null}
     */
    searchBranch = (key,value) => this.terminal().searchUp(key,value);

    /**
     * Recurses through gnode tree to find distance from root
     * @param {number} count 
     * @returns {number} Number of steps to top of gnode tree
     */
    depth = (count=0) => this.parent?.depth(count+1) || count;

    /**
     * Recurses through gnode tree from terminal node to find branch length
     * @returns {number} Total number of Gnodes in this branch
     */
    branchLength = () => this.terminal().depth() + 1;
}