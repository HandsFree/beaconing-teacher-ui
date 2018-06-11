// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

// NOTE
// we could abstract cells to avoid the event list
// stuff and fetch events for each cell including prev
// and next month ones.

class CalendarEvent extends Component {
    async render() {
        const { eventName, eventDesc } = this.props;

        return div(".calendar-event",
            p(`${eventName}`),
            p(`${eventDesc}`),
        )
    }
}

class CalendarEventList extends Component {
    async render() {
        const events = this.props.events;
        if (!events) {
            // no events
            return div(".event-list");
        }

        return Promise.all(events).then((eventEls) => {
            return div(".event-list", eventEls);
        });
    }
}

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const { dayNumber, events } = this.props;
        return div(".calendar-cell", p(".calendar-day", dayNumber), events);
    }
}

class CalendarNextMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div(".calendar-cell .next-month", p(".calendar-day", dayNumber));
    }
}

class CalendarPrevMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div(".calendar-cell .prev-month", p(".calendar-day", dayNumber));
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
    updateHooks = {
        PrevMonth: this.prevMonth,
        NextMonth: this.nextMonth,
        CurrMonth: this.currMonth,
    }
    
    // the date, specifically the month, this calendar
    // will bew a view of.
    constructor() {
        super();

        this.state = {
            currDate: new Date(),
        }
    }

    async currMonth() {
        this.state.currDate = new Date();
    	this.updateView(await this.render());
    }

    async prevMonth() {
        const date = this.state.currDate;
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    	this.state.currDate = new Date(firstDay - 1);
    	console.log("prev ", this.state.currDate);
        this.updateView(await this.render());
    }

    async nextMonth() {
        const date = this.state.currDate;
		const lastDay = new Date(date.getFullYear(), date.getMonth(), date.daysInMonth()+1);
		console.log("last day ", lastDay);
    	this.state.currDate = new Date(lastDay + 1);
    	console.log("next ", this.state.currDate);
    	this.updateView(await this.render());
    }

    async render() {
        console.log("calendar view render!");

        // write the events.

        // calculate how many cells to create
        // for this particular month

        let calDate = this.state.currDate;
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

            const events = [];


            const eventListEl = new CalendarEventList().attach(events);
            
            const cell = new CalendarCell().attach({
                dayNumber: dayNumber,
                events: eventListEl,
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

export default CalendarView;
