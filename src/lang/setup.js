import LocalizedStrings from 'react-localization';
import en from './en.json';
import ar from './en.json';

const locals = {
    en,
    ar
}

export const instance = new LocalizedStrings(locals);
//simplify the interface
export const __ = (key) => instance.getString(key);
