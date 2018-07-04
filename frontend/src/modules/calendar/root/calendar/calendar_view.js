// @flow
import moment from 'moment';

import { div } from '../../../../core/html';
import { Component } from '../../../../core/component';

import { CalendarEvent, CalendarEventList } from './calendar_event';
import { CalendarCell, CalendarHeadingCell, CalendarNextMonthCell, CalendarPrevMonthCell } from './calendar_cell';
import nullishCheck from '../../../../core/util';

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
    };

    state = {
        // the date, specifically the month, this calendar
        // will bew a view of.
        currDate: moment(),
        eventMap: new Map(),
    };

    async refreshCalendarView() {
        // reset any of the previously loaded events before
        // we refresh the glps.
        this.state.eventMap = new Map();

        const studentId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');

        await this.loadEvents(studentId);
        this.updateView(await this.render());
    }

    // the event map stores key => value
    // where the key is the date the event is set
    // specifically the MM/DD/YYYY,
    // the value is an array of events. we append to this
    // array or we insert an array when writing an event.
    // note that we strip the time from the date given
    // so that we can index the hashmap just from mm/dd/yyyy
    writeEvent(eventDate, event: Object) {
        // store the date in the event object
        // WITH the time included.
        event.date = eventDate.toDate();

        const newDate = eventDate.clone().startOf('D');
        console.log('[Calendar] writing ', event, ' time ', newDate);

        const events = this.state.eventMap.get(newDate.format());
        if (events) {
            events.push(event);
            // re-write into hashmap
            this.state.eventMap.set(newDate.format(), events);
        } else {
            this.state.eventMap.set(newDate.format(), [event]);
        }
    }

    async getStudentGLPS(id: number) {
        const assigned = nullishCheck(await window.beaconingAPI.getStudentAssigned(id), []);

        const glps = [];
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
            const studentId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');
            await this.loadEvents(studentId);
        }
    }

    // loads all of the events from the glps
    // of the given student id
    async loadEvents(studentId: number | string) {
        if (studentId === 'none') {
            return;
        }

        console.log(`[Calendar] writing events for student ${studentId}`);

        const glpBoxes = await this.getStudentGLPS(studentId);
        for (const glpBox of glpBoxes) {
            const { glp } = glpBox;

            if (glpBox.availableFrom) {
                const availDate = moment(glpBox.availableFrom).startOf('D');

                console.log(`[Calendar] writing event ${availDate.format()}`);

                this.writeEvent(availDate, {
                    name: glp.name,
                    id: glp.id,
                    desc: glp.description,
                });
            }
        }
    }

    async currMonth() {
        this.state.currDate = moment();
        window.sessionStorage.setItem('calendarDate', this.state.currDate);
        this.updateView(await this.render());
    }

    async prevMonth() {
        const date = this.state.currDate;
        const prevMonth = date.clone().subtract(1, 'M');
        console.log('[Calendar] Previous month ', prevMonth.format());

        this.state.currDate = prevMonth;

        window.sessionStorage.setItem('calendarDate', this.state.currDate);
        this.updateView(await this.render());
    }

    async nextMonth() {
        const date = this.state.currDate;
        const nextMonth = date.clone().add(1, 'M');
        console.log('[Calendar] Next month is ', nextMonth.format());
        this.state.currDate = nextMonth;

        window.sessionStorage.setItem('calendarDate', this.state.currDate);
        this.updateView(await this.render());
    }

    async render() {
        // calculate how many cells to create
        // for this particular month

        const calDate = this.state.currDate;

        const firstDay = calDate.clone().startOf('M');
        console.log("[Calendar] Displaying calendar for ", firstDay.format());

        // rows of calendar cells in the calendar
        const rows = [];

        const calendarDayTranslKeys = ['cal_sunday', 'cal_monday', 'cal_tuesday', 'cal_wednesday', 'cal_thursday', 'cal_friday', 'cal_saturday'];

        for (const key of calendarDayTranslKeys) {
            const dayName = await window.bcnI18n.getPhrase(key);

            const cellProm = new CalendarHeadingCell().attach({ dayName });
            rows.push(cellProm);
        }

        const offset = firstDay.day() - 1;
        const prevMonth = firstDay.clone().subtract(1, 'M').endOf('M');
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

            const cellDate = firstDay.clone().day(i + 1).startOf('D');

            const { eventMap } = this.state;

            // here we attach the event components
            // if there are any events for this day.
            const events = [];

            const eventDateKey = cellDate.clone().startOf('D').format();

            if (eventMap.has(eventDateKey)) {
                const storedEvents = eventMap.get(eventDateKey);
                for (const event of storedEvents) {
                    events.push(new CalendarEvent().attach({
                        name: event.name,
                        desc: '',
                        id: event.id,
                    }));
                }
            }

            const eventList = new CalendarEventList().attach({
                events,
            });
            const cell = new CalendarCell().attach({
                dayNumber,
                cellDate,
                eventList,
            });
            rows.push(cell);
        }

        const remain = 7 - (rows.length % 7);
        for (let dayNumber = 1; dayNumber <= remain; dayNumber++) {
            const cell = new CalendarNextMonthCell().attach({
                dayNumber
            });
            rows.push(cell);
        }

        return Promise.all(rows).then(elements => div('.calendar', elements));
    }
}

export default CalendarView;
