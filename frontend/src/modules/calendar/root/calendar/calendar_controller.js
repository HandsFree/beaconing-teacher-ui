// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

// the left pane which has the controls for the calendar
// regarding students/groups
class CalendarStudentSelector extends Component {

}

// the top menu options above the calendar
class CalendarController extends Component {    
    constructor(studentId) {
        super();
        
        this.state = {
            studentId: studentId,
            currDate: new Date(),
        }
    }

    async emitPrevMonth() {
        this.emit('PrevMonth');

        // FIXME
        // duplicate logic here but it will do for now.
        // this is to keep track of the calendar dates, whatever
        // we do in the calendar view we do here. there is likely
        // a cleaner way to do this, e.g. passing a param to an emit call?
        const date = this.state.currDate;
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    	this.state.currDate = new Date(firstDay - 1);
        
        this.updateView(await this.render());
    }

    async emitCurrMonth() {
        this.emit('CurrMonth');
        this.state.currDate = new Date();
        this.updateView(await this.render());
    }

    async emitNextMonth() {
        this.emit('NextMonth');

        const date = this.state.currDate;
		const lastDay = new Date(date.getFullYear(), date.getMonth(), date.daysInMonth()+1);
    	this.state.currDate = new Date(lastDay + 1);

        this.updateView(await this.render());
    }

    async render() {
        const student = window.beaconingAPI.getStudent(this.state.studentId);

        let studentGreet = "";
        if (this.state.studentId) {
            studentGreet = `${student.username}'s calendar`;
        }

        let monthName = "";
        let year = "";

        if (this.state.currDate) {
            const currDate = this.state.currDate;
            monthName = currDate.getMonthName();            
            year = currDate.getFullYear();
        }

        return div('.calendar-control',
            h2(".calendar-date", `${studentGreet} ${monthName}, ${year}`),

            p(
                span(".fake-link", {
                    onclick: () => this.emitPrevMonth()
                }, "prev"),

                " ",

                span(".fake-link", {
                    href: '',
                    onclick: () => this.emitCurrMonth()
                }, "today"),

                " ",

                span(".fake-link", {
                    href: '',
                    onclick: () => this.emitNextMonth()
                }, "next")
            )
        );
    }
}

Date.prototype.getMonthName = function() {
    var d = new Date(this);
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    return monthNames[d.getMonth()];
}

export default CalendarController;
