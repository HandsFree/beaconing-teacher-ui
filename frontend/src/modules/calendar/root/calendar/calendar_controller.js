// sessionStorageflow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

Date.prototype.getMonthName = function() {
    const d = new Date(this);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    return monthNames[d.getMonth()];
}

// the top menu options above the calendar
class CalendarController extends Component {    
    updateHooks = {
        RefreshCalendarController: this.refresh,
    };

    async refresh() {
        this.updateCalendar('CurrMonth');
    }

    async updateCalendar(updateHook) {
        this.emit(updateHook);
        this.updateView(await this.render());
    }

    async render() {
        const studentId = window.sessionStorage.getItem('calendarStudentID') ?? -1;
       
        let studentGreet = '';
        if (studentId != -1) {
            const student = await window.beaconingAPI.getStudent(studentId);
            
            const calTranslation = await window.bcnI18n.getPhrase('cr_calendar');

            const profile = student.profile;
            if (!profile.firstName) {
                studentGreet = `${student.username}'s ${calTranslation}`;
            } else {
                studentGreet = `${profile.firstName} ${profile.lastName}'s ${calTranslation}`;
            }
        }

        let currDate = new Date();
        if (window.sessionStorage) {
            currDate = new Date(window.sessionStorage.getItem('calendarDate'));
        }

        const monthName = `${currDate.getMonthName()}`;
        const year = `${currDate.getFullYear()}`;

        return div('.calendar-control',
            div('.calendar-meta-info',
                h2('.calendar-name', `${studentGreet}`),
                h2('.calendar-date', `${monthName} ${year}`),
            ),

            p(
                span('.fake-link', {
                    onclick: () => this.updateCalendar('PrevMonth')
                }, 'prev'),

                ' ',

                span('.fake-link', {
                    href: '',
                    onclick: () => this.updateCalendar('CurrMonth')
                }, 'today'),

                ' ',

                span('.fake-link', {
                    href: '',
                    onclick: () => this.updateCalendar('NextMonth')
                }, 'next')
            )
        );
    }
}

export default CalendarController;
