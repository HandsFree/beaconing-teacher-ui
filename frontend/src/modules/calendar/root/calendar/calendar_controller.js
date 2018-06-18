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

    // fixme remove.
    async refresh() {
        this.updateCalendar('CurrMonth');
    }

    async updateCalendar(updateHook) {
        this.emit(updateHook);
        this.updateView(await this.render());
    }

    async render() {
        let studentId = -1;
        if (this.props.calendarView) {
            const view = this.props.calendarView;
            // FIXME wewlad
            studentId = view.state.studentId;
        }

        const student = await window.beaconingAPI.getStudent(studentId);

        let studentGreet = '';
        if (studentId != -1) {
            studentGreet = `${student.username}'s calendar`;
        }

        let currDate = new Date();
        if (window.sessionStorage) {
            currDate = new Date(window.sessionStorage.getItem('calendarDate'));
        }

        const monthName = `${currDate.getMonthName()}`;
        const year = `${currDate.getFullYear()}`;
        studentGreet += ` ${monthName}, ${year}`;

        return div('.calendar-control',
            h2('.calendar-date', `${studentGreet}`),

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
