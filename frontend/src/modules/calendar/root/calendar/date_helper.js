// @flow

// TODO we can bake these translations
// in rather than doing a lookup each time
// it's called

// note that these are also _internationalized_
// date helpers!

const monthNames = [
    'cal_jan', 'cal_feb', 'cal_mar', 'cal_apr', 'cal_may', 'cal_jun', 'cal_jul', 'cal_aug',
    'cal_sept', 'cal_oct', 'cal_nov', 'cal_dec',
];
const dayNames = [
    'cal_sunday', 'cal_monday', 'cal_tuesday', 'cal_wednesday', 'cal_thursday', 'cal_friday', 'cal_saturday',
];

Date.prototype.firstDay = () => {
    const d = new Date(this);
    return new Date(d.getFullYear(), d.getMonth(), 1);
};

Date.prototype.daysInMonth = () => {
    const d = new Date(this);
    return new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
};

Date.prototype.getDayName = () => {
    const d = new Date(this);
    const translationKey = dayNames[d.getDay()];

    return Promise.resolve(window.bcnI18n.getPhrase(translationKey)).then(val => val);
};

Date.prototype.getMonthName = () => {
    const d = new Date(this);
    const translationKey = monthNames[d.getMonth()];

    return Promise.resolve(window.bcnI18n.getPhrase(translationKey)).then(val => val);
};

Date.prototype.withoutTime = () => {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
};
