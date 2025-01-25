import { encodeCoord } from "./sgfUtils";

const escape = (vals) => vals.map(val => val.replaceAll('\\','\\\\').replaceAll(']','\\]'));

const simpletext = (vals) => `${escape(vals[0])}`;

const number = (vals) => `${Math.floor(vals[0])}`;

const real = (vals) => `${vals[0]}`;

const double = number;

const point = (vals) => vals.map(val => `${encodeCoord(val)}`).join('][');

const none = () => ``;

const color = (vals) => `${vals[0]}`;

const eList = (vals) => point(vals) || ``; // only for eList of point

const composed = (vals, ...funcs) => {
    vals.map((val,i) => funcs?.[i](val) || funcs[-1]).join(':');
}

const encodeDates = (dates) => {
    let YYYY,MM;
    return `${dates.map(date => {
        if (date[0] !== YYYY) {
            [YYYY,MM] = date;
            return date.join('-');
        } 
        if (date[1] !== MM) {
            MM = date[1];
            return date.slice(1).join('-');
        }
        return date[2];
    }).join(',')}`;
}

const encodeProperty = {
    // root properties
    AP: vals => composed(vals, simpletext),
    CA: simpletext,
    FF: number,
    GM: number,
    ST: number,
    SZ: vals => vals.every(v => v === vals[0]) ? `${vals[0]}` : `${vals.join(':')}`,
    // game info properties
    AN: simpletext,
    BR: simpletext,
    BT: simpletext,
    CP: simpletext,
    DT: encodeDates,
    EV: simpletext,
    GN: simpletext,
    GC: simpletext,
    ON: simpletext,
    OT: simpletext,
    PB: simpletext,
    PC: simpletext,
    PW: simpletext,
    RE: simpletext, // this one has specific formatting to obey
    RO: simpletext, // this one too
    RU: simpletext, // same here
    SO: simpletext,
    TM: real, 
    US: simpletext,
    WR: simpletext,
    WT: simpletext,
    // move properties
    B: point,
    KO: none,
    MN: number,
    W: point,
    // setup props
    AB: point,
    AE: point,
    AW: point,
    PL: color,
    // node annotation properties
    C: simpletext,
    DM: double,
    GB: double,
    GW: double,
    HO: double,
    N: simpletext,
    UC: double,
    V: real,
    // move annotation props
    BM: double,
    DO: none,
    IT: none,
    TE: double,
    // time move props
    BL: real,
    OB: number,
    OW: number,
    WL: real,
    // markup properties
    AR: vals => vals.map(val => `${val.map(encodeCoord).join(':')}`).join(']['),
    CR: point,
    DD: eList,
    LB: vals => vals.map(val => `${point(val[0])}:${simpletext(val[1])}`).join(']['),
    LN: vals => vals.map(val => `${val.map(encodeCoord).join(':')}`).join(']['),
    MA: point,
    SL: point,
    SQ: point,
    TR: point,
    // misc properties
    FG: vals => vals[0] ? `${Math.floor(vals[0][0])}:${escape(vals[0][1])}` : ``,
    PM: number,
    VW: eList,
    // go-specific
    HA: number,
    KM: real,
    TB: eList,
    TW: eList,
}

export {
    encodeProperty,
};