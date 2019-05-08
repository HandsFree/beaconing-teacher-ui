// @flow
import moment from 'moment';

import { a, h2, p, div } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

const monthTranslationKeys = [
    'cal_jan', 'cal_feb', 'cal_mar', 'cal_apr', 'cal_may', 'cal_jun', 'cal_jul', 'cal_aug',
    'cal_sept', 'cal_oct', 'cal_nov', 'cal_dec',
];

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

    async init() {
        const interfaceKeys = [
            'cal', 'cal_prev', 'cal_current', 'cal_next',
        ];
        this.state = {
            monthTranslations: await window.beaconingAPI.getPhrases(...monthTranslationKeys),
            interfaceTranslations: await window.beaconingAPI.getPhrases(...interfaceKeys),
        };
        console.log(this.state.interfaceTranslations);
    }
    
    async getTranslatedMonthName(date) {
        const monthIndex = date.month();
        const transKey = monthTranslationKeys[monthIndex];

        // this is weird since the translations are actually
        // an object, and we're accessing it like an array
        // but its valid js syntax!
        return this.state.monthTranslations.get(transKey);
    }
    
    async render() {
        const calTranslation = this.state.interfaceTranslations.get('cal');

        let controllerTitle = calTranslation;
        
        const calendarSelection = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
        if (calendarSelection !== 'none') {
            const calendarSelObj = JSON.parse(calendarSelection);

            controllerTitle = do {
                if (calendarSelObj.student !== null) {
                    const { id, username } = calendarSelObj.student;

                    const student = await window.beaconingAPI.getStudent(id);
                    const { firstName, lastName } = student;

                    if (firstName !== '') {
                        `${username}'s ${calTranslation}`;
                    } else {
                        `${firstName} ${lastName}'s ${calTranslation}`;
                    }
                } else if (calendarSelObj.group !== null) {
                    const { name } = calendarSelObj.group;
                    `${name}'s ${calTranslation}`;
                }
            };
        }

        let currDate = moment();
        if (window.sessionStorage) {
            currDate = moment(window.sessionStorage.getItem('calendarDate'));
        }

        const monthName = await this.getTranslatedMonthName(currDate);

        const year = currDate.format('YYYY');

        const { interfaceTranslations } = this.state;
        
        const prevMonthTranslation = interfaceTranslations.get('cal_prev');
        const currMonthTranslation = interfaceTranslations.get('cal_current');
        const nextMonthTranslation = interfaceTranslations.get('cal_next');

        return div(
            '.calendar-control',
            div(
                '.calendar-meta-info',
                h2('.calendar-name', `${controllerTitle}`),
                h2('.calendar-date', `${monthName} ${year}`),
            ),

            div('.calendar-buttons',
                p(a(
                    '.btn',
                    {
                        role: 'button',
                        onclick: () => this.updateCalendar('PrevMonth'),
                    },
                    prevMonthTranslation,
                )),
                ' ',

                !currDate.isSame(moment(), 'D') ? p(a(
                    '.btn',
                    {
                        role: 'button',
                        onclick: () => this.updateCalendar('CurrMonth'),
                    },
                    currMonthTranslation,
                )) : div(),

                p(
                    a(
                        '.btn',
                        {
                            role: 'button',
                            onclick: () => this.updateCalendar('NextMonth'),
                        },
                        nextMonthTranslation,
                    ),
                ),
            ),
        );
    }
}

export default CalendarController;