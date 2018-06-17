// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

import { ClendarEventList, CalendarEvent, CalendarEventList } from './calendar_event';
import { CalendarCell, CalendarHeadingCell, CalendarNextMonthCell, CalendarPrevMonthCell } from './calendar_cell';

// NOTE
// we could abstract cells to avoid the event list
// stuff and fetch events for each cell including prev
// and next month ones.

// the actual calendar
class CalendarView extends Component {    
    updateHooks = {
        PrevMonth: this.prevMonth,
        NextMonth: this.nextMonth,
        CurrMonth: this.currMonth,
        RefreshGLPS: this.refreshGLPS,
    }
    
    // the date, specifically the month, this calendar
    // will bew a view of.
    constructor() {
        super();

        this.state = {
            currDate: new Date(),
            eventMap: new Map(),
            studentId: -1,
        }
    }

    async refreshGLPS() {
        // reset any of the previously loaded events before
        // we refresh the glps.
        this.state.eventMap = new Map();

        this.loadEvents(this.state.studentId);
        // hm?
        this.updateView(await this.render());
    }

    // the event map stores key => value
    // where the key is the date the event is set
    // specifically the MM/DD/YYYY, 
    // the value is an array of events. we append to this
    // array or we insert an array when writing an event.
    // note that we strip the time from the date given
    // so that we can index the hashmap just from mm/dd/yyyy
    writeEvent(eventDate, event) {
        // store the date in the event object
        // WITH the time included.
        event.date = eventDate;

        const newDate = eventDate.withoutTime();
        console.log("writing ", event, " time ", newDate.getTime());

        let events = this.state.eventMap.get(newDate.getTime());
        if (events) {
            events.push(event);
            // re-write into hashmap
            this.state.eventMap.set(newDate.getTime(), events);
        } else {
            this.state.eventMap.set(newDate.getTime(), [event]);
        }
    }

    async getStudentGLPS(id) {
        const assigned = await window.beaconingAPI.getStudentAssigned(id) ?? [];

        let glps = [];
        for (const glp of assigned) {
            const glpObj = await window.beaconingAPI.getGLP(glp.gamifiedLessonPathId, true);
            glps.push({
                glp: glpObj,
                assignedGLPID: glp.id,
                availableFrom: glp.availableFrom,
            });
        }
        return glps;
    }

    async init() {
        if (this.state.studentId) {
            this.loadEvents(this.state.studentId);
        }
    }

    // loads all of the events from the glps
    // of the given student id
    async loadEvents(studentId) {
        if (studentId == -1) return;
        
        console.log(`writing events for student ${studentId}`);

        const glpBoxes = await this.getStudentGLPS(studentId);
        for (const glpBox of glpBoxes) {
            const glp = glpBox.glp;

            if (glpBox.availableFrom) {
                console.log(`writing event ${glpBox.availableFrom}`);

                this.writeEvent(new Date(glpBox.availableFrom), {
                    name: glp.name,
                    id: glp.id,
                    desc: glp.description,
                });
            }
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
		const lastDay = new Date(date.getFullYear(), date.getMonth(), date.daysInMonth() + 1);
		console.log("last day ", lastDay);
    	this.state.currDate = new Date(lastDay + 1);
    	console.log("next ", this.state.currDate);
    	this.updateView(await this.render());
    }

    async render() {
        // calculate how many cells to create
        // for this particular month

        let calDate = this.state.currDate;
        const firstDay = calDate.firstDay();

        // rows of calendar cells in the calendar
        let rows = [];

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

            const eventMap = this.state.eventMap;

            let events = [];
            if (eventMap.has(cellDate.getTime())) {
                const storedEvents = eventMap.get(cellDate.getTime());
                for (const event of storedEvents) {
                    events.push(new CalendarEvent().attach({
                        name: event.name,
                        desc: "",
                        id: event.id,
                    }));
                }
            }

            const eventList = new CalendarEventList().attach({
                events: events,
            });
            const cell = new CalendarCell().attach({
                dayNumber: dayNumber,
                cellDate: cellDate,
                eventList: eventList,
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
    const d = new Date(this);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

Date.prototype.daysInMonth = function() {
    const d = new Date(this);
    return new Date(d.getYear(), d.getMonth()+1, 0).getDate();
}

Date.prototype.getDayName = function() {
    const d = new Date(this);
    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return dayNames[d.getDay()];
}

Date.prototype.getMonthName = function() {
    const d = new Date(this);
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    return monthNames[d.getMonth()];
}

Date.prototype.withoutTime = function () {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default CalendarView;
