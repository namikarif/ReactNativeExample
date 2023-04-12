import moment from 'moment';

export const addMinuteDate = (date, minute) => {
   return moment(date).add(minute, 'minutes').local(true).format('YYYY-MM-DD HH:mm:ss');
}

export const convertDateAndTime = (date: any, dateFormat) => {
    return this.fullDate = makeDate(date, dateFormat) + ' ' + convertTime(date);
}

export const getSeconds = (date: Date) => {
    const _date = moment(date);
    return moment.duration(_date.diff(new Date())).asSeconds();
}

export const convertTime = (date: any) => {
    let hour = '00';
    let minute = '00';
    let second = '00';
    if (date.getHours() < 10) {
        hour = '0' + date.getHours();
    } else {
        hour = date.getHours();
    }
    if (date.getMinutes() < 10) {
        minute = '0' + date.getMinutes();
    } else {
        minute = date.getMinutes();
    }
    if (date.getSeconds() < 10) {
        second = '0' + date.getSeconds();
    } else {
        second = date.getSeconds();
    }
    return hour + ':' + minute + ':' + second;
}

export const makeDate = (date: Date, dateFormat?) => {
    dateFormat = dateFormat ? dateFormat : 'YYYY-MM-DD';
    const year = date.getFullYear();
    let month, day, fullDate;
    if (date.getMonth() < 9) {
        month = '0' + (date.getMonth() + 1);
    } else {
        month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
        day = '0' + date.getDate();
    } else {
        day = date.getDate();
    }
    switch (dateFormat.toLowerCase()) {
        // with dot
        case 'dd.mm.yyyy':
            fullDate = day + '.' + month + '.' + year;
            break;
        case 'mm.dd.yyyy':
            fullDate = month + '.' + day + '.' + year;
            break;
        case 'yyyy.mm.dd':
            fullDate = year + '.' + month + '.' + day;
            break;
        // with -
        case 'dd-mm-yyyy':
            fullDate = day + '-' + month + '-' + year;
            break;
        case 'mm-dd-yyyy':
            fullDate = month + '-' + day + '-' + year;
            break;
        case 'yyyy-mm-dd':
            fullDate = year + '-' + month + '-' + day;
            break;
        // with /
        case 'dd/mm/yyyy':
            fullDate = month + '/' + day + '/' + year;
            break;
        case 'mm/dd/yyyy':
            fullDate = month + '/' + day + '/' + year;
            break;
        case 'yyyy/mm/dd':
            fullDate = year + '/' + month + '/' + day;
            break;

        case 'd/mm/yyyy':
            fullDate = month + '/' + day + '/' + year;
            break;
    }
    return fullDate;
};
