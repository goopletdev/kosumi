import { parseCoord } from "./sgfUtils";

/**
 * Returns a parsed number if it is in the expected range, or throws and error
 * @param {string} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {[number]} Property value parsed to integer
 */
const range = (val, min, max) => {
    const num = parseInt(val);
    if (num <= max && num >= min) return [num];
    const errorMessage = `[${val}] is not allowed`;
    if (num !== num) throw new TypeError(errorMessage);
    throw new RangeError(errorMessage);
}

/**
 * Tries parsing property value to integer
 * @param {string} val 
 * @returns {[number]} Property value parsed to integer
 */
const number = (val) => {
    // currently expectInt and expectFloat will allow for erroneous characters;
    // this should still throw an error. add error handling for this later
    const num =  parseInt(val);
    if (num===num) return [num];
    throw new TypeError(`[${val}] is not allowed`);
}

/**
 * Tries parsing property value to float
 * @param {string} val 
 * @returns {[number]} Property value parsed to float
 */
const real = (val) => {
    const num = parseFloat(val);
    if (num===num) return [num];
    throw new TypeError(`[${val}] is not allowed`);
}

/**
 * Replaces non-linebreak whitespace with ' ' and restores escaped colons
 * @param {string} val 
 * @returns {[string]} Correctly-formatted SGF text
 */
const text = (val) => {
    return [val.replaceAll('<ESCAPEDCOLON>',':')
        .replaceAll('\r','\n')
        .replaceAll(new RegExp(/[\t\f\v]/, 'g'),' ')];
}

/**
 * Replaces whitespace (including linebreaks) with ' ' 
 * @param {string} val 
 * @returns {[string]} Correctly-formatted SGF simpletext
 */
const simpleText = (val) => [text(val)[0].replaceAll('\n',' ')];

/**
 * Returns a parsed 'double', which is a 1 or a 2
 * @param {string} val 
 * @returns {number} Integer
 */
const double = (val) => {
    if (/[12]/.test(val) && val.length === 1) return [parseInt(val)];
    throw new Error(`[${val}] is not allowed`);
}

/**
 * Checks whether property value is empty
 * @param {''} val Empty string
 * @returns {[]} Empty array
 * @throws {Error} if val is not an empty string
 */
const none = (val) => {
    if (val) throw new Error(`[${val}] is not allowed`);
    return [];
}

/**
 * Checks whether move is allowed by SGF specifications, parses to num array
 * @param {string} val SGF coordinate
 * @returns {[[number,number]]} coordinate tuple
 */
const move = (val) => {
    // currently this requires 2 dimensions exactly
    // this should be updated to check for compatibility with board dimensions
    // this also only allows only one move per turn, 
    // and doesn't allow empty propvals for passing
    if (/[A-Za-z]/.test(val) && val.length === 2) return [parseCoord(val)];
    throw new Error(`[${val}] is not allowed`);
}

/**
 * Parses compressed and regular SGF coordinates into numeric coordinates
 * @param {string} val SGF coordinate or compressed coordinate e.g. wx:yz
 * @returns {Array.<[number,number]>} 2d array of numeric coordinates
 */
const point = (val) => {
    const coords =  val.split(':').map(x => move(x)[0]);
    if (coords.length === 1) return [coords];
    let unzipped = [];

    for (let x = coords[0][0]; x <= coords[1][0]; x++) {
        for (let y = coords[0][1]; y <= coords[1][1]; y++) {
            unzipped.push([x,y]);
        }
    }

    return unzipped;
}

/**
 * Checks whether string is an allowed SGF color property
 * @param {'B' | 'W'} val SGF color name
 * @returns {['B' | 'W']} SGF color name
 * @throws Will throw an error if called with a disallowed color name
 */
const color = (val) => {
    // consider adding support for other colors like URG (blue red green)
    if (/[BW]/.test(val) && val.length === 1) return [val];
    throw new Error(`[${val}] is not allowed`);
}

/**
 * Splits a composed value into an array, and runs the corresponding function
 * on each item. If there are fewer functions than items, it will call the 
 * last function on each remaining item. 
 * @param {string} val Composed value < value ':' value >
 * @param  {...function} funcs Callback functions
 * @returns {[Array.<any>]} Parsed SGF property values
 * @throws {RangeError} if the split value has fewer items than funcs
 */
const composed = (val, ...funcs) => {
    const vals = val.split(':');
    if (vals.length < funcs.length) throw new RangeError(`[${val}] is not allowed`);
    return [vals.flatMap((val,index) => {
        const func = funcs?.[index] ? funcs[index] : funcs[-1];
        return func(val).flat();
    })];
}

/**
 * Like point() but allows for an empty property value
 * @param {'' | string} val Empty string or zipped/unzipped SGF coords
 * @returns {[] | Array.<[number,number]>[]} Array of parsed SGF coord/coords
 * or empty array
 */
const eList = (val) => {
    // always eList of point
    return val ? point(val) : [];
}

/**
 * 
 * @param {string} val 
 * @returns 
 */
const parseDates = (val) => {
    let YYYY,MM,DD;
    return val.split(',').map(date => {
        console.log(date);
        date = date.split('-');
        console.log(date);
        if (date[0].length === 4) [YYYY,MM,DD] = date;
        else if (date.length === 2 || !DD) [MM,DD] = date;
        else [DD] = date;
        return [YYYY,MM,DD].filter(Boolean).map(x => parseInt(x));
    });
}

const parseProperty = {
    AP: (val) => val.split(':').map(simpleText),
    CA: simpleText,
    FF: (val) => range(val,1,4),
    GM: (val) => range(val,1,1),
    ST: (val) => range(val,0,3),
    SZ: (val) => val.split(':').map(number),
    AN: simpleText,
    BR: simpleText,
    BT: simpleText,
    CP: simpleText,
    DT: parseDates,
    EV: simpleText,
    GN: simpleText,
    GC: simpleText,
    ON: simpleText,
    OT: simpleText,
    PB: simpleText,
    PC: simpleText,
    PW: simpleText,
    RE: simpleText,
    RO: simpleText,
    RU: simpleText,
    SO: simpleText,
    TM: real,
    US: simpleText,
    WR: simpleText,
    WT: simpleText,
    B: move,
    KO: none,
    MN: number,
    W: move,
    AB: point,
    AE: point,
    AW: point,
    PL: color,
    C: text,
    DM: double,
    GB: double,
    GW: double,
    HO: double,
    N: simpleText,
    UC: double,
    V: real,
    BM: double,
    DO: none,
    IT: none,
    TE: double,
    BL: real,
    OB: number,
    OW: number,
    WL: real,
    AR: (val) => composed(val,point,point),
    CR: point,
    DD: eList,
    LB: (val) => composed(val,point,simpleText),
    LN: (val) => composed(val,point,point),
    MA: point,
    SL: point,
    SQ: point,
    TR: point,
    FG: (val) => val ? composed(val,number,simpleText) : none(val),
    PM: number,
    VW: eList,
    HA: number,
    KM: real,
    TB: eList,
    TW: eList,
}

export {
    parseProperty,
    // the rest of these are for testing only:
    range,
    number,
    real,
    text,
    simpleText,
    double,
    none,
    move,
    point,
    color,
    composed,
    eList,
    parseDates,
}