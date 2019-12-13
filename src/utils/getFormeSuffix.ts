import { Forme } from './Forme';

export const getIconFormeSuffix = (forme: keyof typeof Forme) => {
    if (forme == null) return '';
    if (forme === 'Normal') return '';
    if (['Heat', 'Frost', 'Fan', 'Wash', 'Mow'].includes(forme)) return '-' + forme.toLowerCase();
    if (forme === '10%') return '-10-percent';
    if (forme === 'Complete') return '-complete';
    if (forme === '!') return '-exclamation';
    if (forme === '?') return '-question';
    if (Forme[forme]) return `-${Forme[forme]}`;
    return '';
};
