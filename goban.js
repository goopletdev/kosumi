//still figuring out what to do with this
import ParseSGF from './parse-sgf.js';

class Goban {
    /**
     * 
     * @param {number?} columns 
     * @param {number?} rows 
     * @param {0|1|2|3?} style 
     */
    constructor(columns=19,rows=null,style=0) {

        this.root = {
            AP: 'Kosumi:1.0',
            CA: 'ISO-8859-1',
            FF: 4,
            GM: 1,
            ST: style,
        }

        if (!rows) {
            this.root.SZ = [columns,columns];
        } else if (columns === rows) {
            this.root.SZ = [columns,columns];
        } else {
            this.root.SZ = [columns,rows];
        }

        this.tree = {};
    }

    async parse(sgf, gameIndex=0) {
        this.tree = ParseSGF(sgf)[gameIndex];
        this.sourceSGF = sgf;
    }
}

