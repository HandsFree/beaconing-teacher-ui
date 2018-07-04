// @flow
import moment from 'moment';

import { h2, p, div, span } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

// the top menu options above the calendar
class CalendarController extends Component {
    updateHooks = {
        RefreshCalendarController: this.refresh,
    };

    async init() {
    }

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
        // clean me

        let controllerTitle = '';
        
        const calendarSelection = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
        if (calendarSelection !== 'none') {
            const calendarSelObj = JSON.parse(calendarSelection);
            
            const calTranslation = await window.bcnI18n.getPhrase('calendar');
    
            controllerTitle = do {
                if (calendarSelObj.student !== null) {
                    const {id, username} = calendarSelObj.student;
                    
                    const student = await window.beaconingAPI.getStudent(id);
                    const {firstName, lastName} = student;

                    if (firstName !== '') {
                        controllerTitle = `${username}'s ${calTranslation}`;
                    } else {
                        controllerTitle = `${firstName} ${lastName}'s ${calTranslation}`;
                    }
                } else if (calendarSelObj.group !== null) {
                    const {id, name} = calendarSelObj.group;
                    controllerTitle = `${name}'s ${calTranslation}`;
                }
            };
        }

        // 

        let currDate = moment();
        if (window.sessionStorage) {
            currDate = moment(window.sessionStorage.getItem('calendarDate'));
        }

        const monthName = await this.getTranslatedMonthName(currDate);

        const year = currDate.format('YYYY');

        const selMonthTranslation = await window.bcnI18n.getPhrase('cal_sel_month');
        const prevMonthTranslation = await window.bcnI18n.getPhrase('cal_prev');
        const currMonthTranslation = await window.bcnI18n.getPhrase('cal_current');
        const nextMonthTranslation = await window.bcnI18n.getPhrase('cal_next');

        return div(
            '.calendar-control',
            div(
                '.calendar-meta-info',
                h2('.calendar-name', `${controllerTitle}`),
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
