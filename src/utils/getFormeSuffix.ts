export enum Forme {
    // NOTE: Normal is not technically considered a "forme"

    A = 'a',
    B = 'b',
    C = 'c',
    D = 'd',
    E = 'e',
    F = 'f',
    G = 'g',
    H = 'h',
    I = 'i',
    J = 'j',
    K = 'k',
    L = 'l',
    M = 'm',
    N = 'n',
    O = 'o',
    P = 'p',
    Q = 'q',
    R = 'r',
    S = 's',
    T = 't',
    U = 'u',
    V = 'v',
    W = 'w',
    X = 'x',
    Y = 'y',
    Z = 'z',
    Exclamation = 'exclamation',
    Question = 'question',

    // Mega = 'mega',
    'Mega-X' = 'mega-x',
    'Mega-Y' = 'mega-y',

    Alolan = 'alola',

    Sunny = 'sunny',
    Rainy = 'rainy',
    Snowy = 'snowy',

}


export const getFormeSuffix = (forme: keyof typeof Forme) => {
    if (Forme[forme]) return `-${Forme[forme]}`;
    return '';
};