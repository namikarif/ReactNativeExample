import AsyncStorage from '@react-native-async-storage/async-storage';


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        },
    );
}

const storageSet = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {

    }
};

const storageGet = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
    }
};

const storageSetObject = async (key: string, value: Object) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
    }
};

const storageMultiRemove = async (keys: Array<string>) => {
    try {
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
    }
};

const storageRemove = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
    }
};

const storageGetObject = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return JSON.parse(value);
    } catch (e) {
    }
};

const hasOwenProperty = (object, value) => {
    try {
        if (object.hasOwnProperty(value) === true) {
            return object.value.toString();
        }
    } catch {
        return '';
    }
};

const toIntExt = (value) => {
    if (value !== null) {
        if (typeof value === 'string') {
            return Number(value);
        } else if (typeof value === 'number') {
            return value;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

const getRandomArray = (array, count) => {
    let result = new Array(count),
        len = array.length,
        taken = new Array(len);
    while (count--) {
        let x = Math.floor(Math.random() * len);
        result[count] = array[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export function convertToFloat(value) {
    try {
        if (value === '') {
            return 0;
        }

        if (value === undefined) {
            return 0;
        }

        if (value.indexOf(',') === value.length - 3) {
            value = value.replace('.', '').replace(',', '.');
        } else {
            value = value.replace(',', '');
        }
        return parseFloat(value, 10);
    } catch (err) {
        return value;
    }
}

export function round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

export function deepCopy(source) {
    if (source === undefined) {
        return null;
    } else {
        return JSON.parse(JSON.stringify(source));
    }
}

export function numberFormat(lang, value) {
    try {
        let formatted;

        if (value === '') {
            return 0;
        }

        if (value === undefined) {
            return 0;
        }

        const number = parseFloat(value.replace(',', '.'));

        if (lang === 'tr') {
            formatted = value.toLocaleString('tr-TR');
        }

        if (lang === 'en') {
            formatted = value.toLocaleString('en-US');
        }
        return formatted;
    } catch (err) {
        return value;
    }
}

export function numberPrefix(lang, value) {
    try {
        let decimalSperator = ',';
        let newText = '';

        if (value === '') {
            return 0;
        }

        if (value === undefined) {
            return 0;
        }

        if (lang === 'tr') {
            decimalSperator = ',';
        }

        if (lang === 'en') {
            decimalSperator = '.';
        }

        let numbers = '0123456789' + decimalSperator;

        for (let i = 0; i < value.length; i++) {
            if (numbers.indexOf(value[i]) > -1) {
                newText = newText + value[i];
                if (value[i] === decimalSperator) {
                    numbers = '0123456789';
                }
            } else {
            }
        }

        if (isNaN(newText)) {
            return '0';
        }

        return newText;
    } catch (err) {
        return value;
    }
}

const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(RegExp(find), 'g'), replace);
}

export default {
    getRandomArray,
    replaceAll,
    toIntExt,
    storageSet,
    storageGet,
    storageSetObject,
    storageGetObject,
    storageMultiRemove,
    storageRemove,
    createUUID,
    convertToFloat,
    numberFormat,
    numberPrefix,
    round,
    deepCopy,
    hasOwenProperty,
};
