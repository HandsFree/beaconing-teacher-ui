// @flow
import { h2, p, div, span } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

// https://github.com/palantir/blueprint/issues/959
let moment = require("moment");
if ("default" in moment) {
    moment = moment["default"];
}

// the top menu options above the calendar
class CalendarController extends Component {
    updateHooks = {
        RefreshCalendarController: this.refresh,
    };

    async refresh() {
        this.updateCalendar('CurrMonth');
    }

    async updateCalendar(updateHook: string) {
        this.emit(updateHook);
        this.updateView(await this.render());
    }

    // FIXME
    async getTranslatedMonthName(date) {
        const monthNames = [
            'cal_jan', 'cal_feb', 'cal_mar', 'cal_apr', 'cal_may', 'cal_jun', 'cal_jul', 'cal_aug',
            'cal_sept', 'cal_oct', 'cal_nov', 'cal_dec',
        ];
        const monthIndex = date.month();
        return await window.bcnI18n.getPhrase(monthNames[monthIndex]);   
    }

    async render() {
        const studentId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');

        let studentGreet = '';
        if (studentId !== 'none') {
            const student = await window.beaconingAPI.getStudent(studentId);

            const calTranslation = await window.bcnI18n.getPhrase('calendar');

            const { profile } = student;

            if (!profile.firstName) {
                studentGreet = `${student.username}'s ${calTranslation}`;
            } else {
                studentGreet = `${profile.firstName} ${profile.lastName}'s ${calTranslation}`;
            }
        }

        let currDate = moment();
        if (window.sessionStorage) {
            currDate = moment(window.sessionStorage.getItem('calendarDate'));
        }

        const monthName = await this.getTranslatedMonthName(currDate);

        const year = currDate.format('YYYY');

        const selMonthTranslation = await window.bcnI18n.getPhrase('cal_sel_month');
        const prevMonthTranslation = await window.bcnI18n.getPhrase('cal_prev');
        const currMonthTranslation = await window.bcnI18n.getPhrase('cal_today');
        const nextMonthTranslation = await window.bcnI18n.getPhrase('cal_next');

        return div(
            '.calendar-control',
            div(
                '.calendar-meta-info',
                h2('.calendar-name', `${studentGreet}`),
                h2('.calendar-date', `${monthName} ${year}`),
            ),

            p(
                `${selMonthTranslation}: `,

                span('.fake-link', {
                    onclick: () => this.updateCalendar('PrevMonth'),
                }, prevMonthTranslation),

                ', ',

                span('.fake-link', {
                    href: '',
                    onclick: () => this.updateCalendar('CurrMonth'),
                }, currMonthTranslation),

                ', ',

                span('.fake-link', {
                    href: '',
                    onclick: () => this.updateCalendar('NextMonth'),
                }, nextMonthTranslation),
            ),
        );
    }
}

export default CalendarController;
