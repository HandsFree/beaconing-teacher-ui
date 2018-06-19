// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

import { ClendarEventList, CalendarEvent, CalendarEventList } from './calendar_event';
import { CalendarCell, CalendarHeadingCell, CalendarNextMonthCell, CalendarPrevMonthCell } from './calendar_cell';
import './date_helper';

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
        RefreshCalendarView: this.refreshCalendarView,
    }
    
    state = {
        // the date, specifically the month, this calendar
        // will bew a view of.
        currDate: new Date(),
        eventMap: new Map(),
    }

    async refreshCalendarView() {
        // reset any of the previously loaded events before
        // we refresh the glps.
        this.state.eventMap = new Map();

        const studentId = window.sessionStorage.getItem('calendarStudentID') ?? -1;
        this.loadEvents(studentId);

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
        console.log('[Calendar] writing ', event, ' time ', newDate.getTime());

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
        if (window.sessionStorage) {
            const studentId = window.sessionStorage.getItem("calendarStudentID") ?? -1;
            this.loadEvents(studentId);
        }
    }

    // loads all of the events from the glps
    // of the given student id
    async loadEvents(studentId) {
        if (studentId == -1) return;
        
        console.log(`[Calendar] writing events for student ${studentId}`);

        const glpBoxes = await this.getStudentGLPS(studentId);
        for (const glpBox of glpBoxes) {
            const glp = glpBox.glp;

            if (glpBox.availableFrom) {
                console.log(`[Calendar] writing event ${glpBox.availableFrom}`);

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
        window.sessionStorage.setItem('calendarDate', this.state.currDate);
    	this.updateView(await this.render());
    }

    async prevMonth() {
        const date = this.state.currDate;
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.state.currDate = new Date(firstDay - 1);
        window.sessionStorage.setItem('calendarDate', this.state.currDate);
    	console.log('[Calendar] prev ', this.state.currDate);
        this.updateView(await this.render());
    }

    async nextMonth() {
        const date = this.state.currDate;
		const lastDay = new Date(date.getFullYear(), date.getMonth(), date.daysInMonth()+1);
		console.log('[Calendar] last day ', lastDay);
        this.state.currDate = new Date(lastDay + 1);
        window.sessionStorage.setItem('calendarDate', this.state.currDate);
    	console.log('[Calendar] ', this.state.currDate);
    	this.updateView(await this.render());
    }

    async render() {
        // calculate how many cells to create
        // for this particular month

        let calDate = this.state.currDate;
        const firstDay = calDate.firstDay();

        // rows of calendar cells in the calendar
        let rows = [];

        const calendarDayTranslKeys = ['cal_sunday', 'cal_monday', 'cal_tuesday', 'cal_wednesday', 'cal_thursday', 'cal_friday', 'cal_saturday'];

        for (const key of calendarDayTranslKeys) {
            const dayName = await window.bcnI18n.getPhrase(key);

            const cellProm = new CalendarHeadingCell().attach({ dayName: dayName });
            rows.push(cellProm);
        }

        const offset = firstDay.getDay() - 1;
        const prevMonth = new Date(firstDay - 1);
        const prevMonthDays = prevMonth.daysInMonth();

        // calculates how many cells to create for the
        // previous month offset.
        for (let i = 0; i < offset; i++) {
            const dayNum = (prevMonthDays - offset) + i + 1;
            const cell = new CalendarPrevMonthCell().attach({
                dayNumber: dayNum,
            });
            rows.push(cell);
        }

        // work out days in current month
        const numDays = calDate.daysInMonth();
        for (let i = offset; i < offset + numDays; i++) {
            const dayNumber = (i - offset) + 1;

            const cellDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), dayNumber).withoutTime();

            const eventMap = this.state.eventMap;

            // here we attach the event components
            // if there are any events for this day.
            let events = [];
            if (eventMap.has(cellDate.getTime())) {
                const storedEvents = eventMap.get(cellDate.getTime());
                for (const event of storedEvents) {
                    events.push(new CalendarEvent().attach({
                        name: event.name,
                        desc: '',
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
            rows.push(cell);
        }

        const remain = 7 - (rows.length % 7);
        for (let i = 0; i < remain; i++) {
            const cell = new CalendarNextMonthCell().attach();
            rows.push(cell);
        }

        return Promise.all(rows).then((elements) => {
            return div('.calendar', elements);
        });
    }
}

export default CalendarView;
