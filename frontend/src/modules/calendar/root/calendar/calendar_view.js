// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

// NOTE
// we could abstract cells to avoid the event list
// stuff and fetch events for each cell including prev
// and next month ones.

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const dayNumber = this.props.dayNumber;
        return div(".calendar-cell", [p(".calendar-day", dayNumber)]);
    }
}

class CalendarNextMonthCell extends Component {
    async render() {
        const dayNumber = this.props.dayNumber;
        return div(".calendar-cell .next-month", [p(".calendar-day", dayNumber)]);
    }
}

class CalendarPrevMonthCell extends Component {
    async render() {
        const dayNumber = this.props.dayNumber;
        return div(".calendar-cell .prev-month", [p(".calendar-day", dayNumber), []]);
    }
}

class CalendarHeadingCell extends Component {
    constructor(name) {
        super();
        this.name = name;
    }

    async render() {
        return div(".calendar-heading-cell", p(this.name));
    }
}

// the actual calendar
class CalendarView extends Component {    
    // the date, specifically the month, this calendar
    // will bew a view of.
    constructor(date) {
        super();
        console.log("calendar view!");

        this.state = {
            date: date,
        };
    }

    async render() {
        console.log("calendar view render!");

        // write the events.

        // calculate how many cells to create
        // for this particular month

        let calDate = this.state.date;
        const firstDay = calDate.firstDay();

        // rows of calendar cells in the calendar
        let rows = [];

        console.log("setting calendar days");

        const calendarDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        for (const dayName of calendarDayNames) {
            console.log("day name set yo!");
            const cellProm = new CalendarHeadingCell(dayName).attach();
            rows.push(cellProm);
        }

        const offset = firstDay.getDay() - 1;
        const prevMonth = new Date(firstDay - 1);
        const prevMonthDays = prevMonth.daysInMonth();

        // this is a buffer that is cleared every 7
        // cells.
        let rowBuffer = [];

        // calculates how many cells to create for the
        // previous month offset.
        for (let i = 0; i < offset; i++) {
            const dayNum = (prevMonthDays - offset) + i + 1;
            const cell = new CalendarPrevMonthCell().attach({
                dayNumber: dayNum,
            });
            rowBuffer.push(cell);
        }

        // work out days in current month
        const numDays = calDate.daysInMonth();
        for (let i = offset; i < offset + numDays; i++) {
            const dayNumber = (i - offset) + 1;

            // flush buffer every 7 days.
            if ((i % 7 == 0 && i > 0)) {
                for (const cell of rowBuffer) {
                    rows.push(cell);
                }
                rowBuffer = [];
            }

            const cellDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), dayNumber).withoutTime();

            const cell = new CalendarCell().attach({
                dayNumber: dayNumber,
            });
            rowBuffer.push(cell);
        }

        if (rowBuffer.length > 0) {
            for (const row of rowBuffer) {
                rows.push(row);
            }

            const remain = 7 - rowBuffer.length;
            for (let i = 0; i < remain; i++) {
                const cell = new CalendarNextMonthCell().attach();
                rows.push(cell);
            }

            rowBuffer = [];
        }

        // work out padding of days for next months

        // ?
        return Promise.all(rows).then((elements) => {
            return div(".calendar", elements);
        });
    }
}

// the controller options and the view
class CalendarController extends Component {
    async init() {
        console.log("calendar controller!");
    }

    async render() {
        console.log("calendar controller render!");
        
        const view = new CalendarView(new Date());

        return Promise.all([
            view.attach(),
        ]).then((values) => {
            const [
                viewEl
            ] = values;

            return viewEl;
        });
    }
}

// date helper stuff

Date.prototype.firstDay = function() {
    var d = new Date(this);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

Date.prototype.daysInMonth = function() {
    var d = new Date(this);
    return new Date(d.getYear(), d.getMonth()+1, 0).getDate();
}

Date.prototype.getDayName = function() {
    var d = new Date(this);
    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return dayNames[d.getDay()];
}

Date.prototype.getMonthName = function() {
    var d = new Date(this);
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    return monthNames[d.getMonth()];
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default CalendarController;
