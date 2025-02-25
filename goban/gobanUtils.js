const coords = (style) => {
    const styles = [];
    if (style === 'sgf') {
        styles.push('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        styles.push(styles[0]);
        return styles;
    } 

    for (const char of style) {
        switch (char) {
            case 'A':
                styles.push('ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz');
                break;
            case '1':
                styles.push(Array(50).fill(0).map((_,i) => `${i+1}`));
                break;
        }
    }

    return styles;
}

const STARS = { 
    9: [20,24,40,56,60],
    13: [42, 81, 120, 45, 84, 123, 48, 87, 126],
    19: [60, 174, 288, 66, 180, 294, 72, 186, 300]
}
const starPoints = (width,height=width) => {
    if (width === height && STARS[width]) {
        return STARS[width];
    } else if (width % 2 && height % 2) {
        return [Math.floor(width/2) + Math.floor(height/2) * width];
    } else return [];    
}

const COLORS = { // default color values
    wood: '#ffc95e',//'burlywood',
    line: 'black',
    player: [
        ,
        'black',
        'white',
        // bonus colors for variants:
        '#5586DB',// blueish
        '#A3395B',// reddish
    ],
    background: '#deb7ff',
}

export {
    coords,
    starPoints,
    COLORS,
}