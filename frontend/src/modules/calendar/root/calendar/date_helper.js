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

class CustomDate extends Date {
    async getTrans(key: string) {
        const trans = await window.bcnI18n.getPhrase(key);

        return trans;
    }

    firstDay() {
        const now = new Date(this);
        return new CustomDate(now.getFullYear(), now.getMonth(), 1);
    }

    daysInMonth() {
        const now = new Date(this);
        const d = new CustomDate(now.getYear(), now.getMonth() + 1, 0).getDate();
        return d;
    }

    async getDayName() {
        return this.getTrans(dayNames[this.getDay()]);
    }

    async getMonthName() {
        return this.getTrans(monthNames[this.getMonth()]);
    }

    withoutTime() {
        this.setHours(0, 0, 0, 0);
        return this;
    }
}

export default CustomDate;
