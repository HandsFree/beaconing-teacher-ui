// @flow
import moment from 'moment';

import { div } from '../../../../core/html';
import { Component } from '../../../../core/component';

import { CalendarEvent, CalendarDueEvent, CalendarEventList } from './calendar_event';
import {
    CalendarCell,
    CalendarHeadingCell,
    CalendarNextMonthCell,
    CalendarPrevMonthCell,
} from './calendar_cell';
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
        WriteDueEvent: this.writeDueEvent,
        ClearDueEvent: this.clearDueEvent,
    };

    state = {
        // the date, specifically the month, this calendar
        // will bew a view of.
        currDate: moment(),
        eventMap: new Map(),

        // the current event that is due
        currentDueEvent: {},
    };

    async clearDueEvent() {
        this.state.currentDueEvent = {};
        this.updateView(await this.render());
    }

    // TODO handle if event is due on the same day
    async writeDueEvent(event: CustomEvent) {
        const { detail } = event;

        const { id, name, due } = detail;

        const eventProm = new CalendarDueEvent().attach({
            name, id, due,
        });

        // we could write this with "writeEvent" but it's
        // easier to just have one due date event rendered
        // at a time. this could easily be expanded to multiple
        this.state.currentDueEvent = {
            eventProm,
            date: due,
        };

        if (!this.state.currDate.isSame(due, 'M')) {
            this.emit('RefreshCalendarController');
            this.gotoDate(due);
        } else {
            this.updateView(await this.render());
        }
    }

    async refreshCalendarView() {
        // reset any of the previously loaded events before
        // we refresh the glps.
        this.state.eventMap = new Map();

        const calendarSelJSON = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
        if (calendarSelJSON !== 'none') {
            const calendarSel = JSON.parse(calendarSelJSON);
            await this.loadEvents(calendarSel);
        }

        this.updateView(await this.render());
    }

    // the event map stores key => value
    // where the key is the date the event is set
    // specifically the MM/DD/YYYY,
    // the value is an array of events. we append to this
    // array or we insert an array when writing an event.
    // note that we strip the time from the date given
    // so that we can index the hashmap just from mm/dd/yyyy
    async writeEvent(eventDate: any, event: Object) {
        // store the date in the event object
        // WITH the time included.
        event.date = eventDate.toDate();

        const newDate = eventDate.clone().startOf('D');
        console.log('[Calendar] writing', event.name, 'at', newDate.format());

        const events = nullishCheck(this.state.eventMap.get(newDate.format()), 'none');
        if (events !== 'none') {
            events.push(event);
            // re-write into hashmap
            this.state.eventMap.set(newDate.format(), events);
        } else {
            this.state.eventMap.set(newDate.format(), [event]);
        }
    }

    async getStudentGLPS(id: number) {
        const assigned = nullishCheck(await window.beaconingAPI.getStudentAssigned(id, true), []);

        const glps = [];
        for (const glpObj of assigned) {
            const obj = {
                glp: glpObj,
                assignedGLPID: glpObj.id,
                availableFrom: glpObj.availableFrom,
            };
            glps.push(obj);
        }
        return glps;
    }

    async loadGroupEvents(group: number) {
        console.log(`[Calendar] writing events for group ${group}`);

        const glps = await window.beaconingAPI.getGroupAssigned(group, true);
        console.log(`[Calendar] loaded ${glps.length} events`);

        for (const glp of glps) {
            console.log('the glp is ', glp);
            this.writeEvent(moment(glp.availableFrom).startOf('D'), glp);
        }
    }

    async loadStudentEvents(studentId: number) {
        console.log(`[Calendar] writing events for student ${studentId}`);

        // TODO cache this...?
        const glpBoxes = await this.getStudentGLPS(studentId);
        for (const glpBox of glpBoxes) {
            const { glp } = glpBox;

            // TODO optimize me!
            if (nullishCheck(glp, false) && glpBox.availableFrom) {
                const availDate = moment(glpBox.availableFrom).startOf('D');

                this.writeEvent(availDate, {
                    name: glp.name,
                    desc: glp.description,
                    id: glp.id,
                    due: glp.availableUntil,
                    avail: glp.availableFrom,
                });
            }
        }
    }

    async loadEvents(calendarSelection: any) {
        if (calendarSelection.student !== null) {
            console.log('[Calendar] Loading student events');
            const { id } = calendarSelection.student;
            await this.loadStudentEvents(id);
        } else if (calendarSelection.group !== null) {
            console.log('[Calendar] Loading group events');
            const { id } = calendarSelection.group;
            await this.loadGroupEvents(id);
        }
    }

    async currMonth() {
        // we're already on the same day there is no need
        // to trigger a re-render
        if (this.state.currDate.isSame(moment(), 'D')) {
            return;
        }

        this.state.currDate = moment();
        window.sessionStorage.setItem('calendarDate', this.state.currDate);

        this.updateView(await this.render());
    }

    async gotoDate(date: any) {
        this.state.currDate = date.clone().startOf('month');
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
        console.log('[Calendar] Displaying calendar for ', firstDay.format());

        // rows of calendar cells in the calendar
        const rows = [];

        const calendarDayTranslKeys = [
            'cal_sunday',
            'cal_monday',
            'cal_tuesday',
            'cal_wednesday',
            'cal_thursday',
            'cal_friday',
            'cal_saturday',
        ];

        calendarDayTranslKeys.forEach(async (key) => {
            const dayName = await window.bcnI18n.getPhrase(key);

            const cellProm = new CalendarHeadingCell().attach({ dayName });
            rows.push(cellProm);
        });

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
            const eventsProm = [];
            const rawEventsList = [];

            const eventDateKey = cellDate.clone().startOf('D').format();

            if (eventMap.has(eventDateKey)) {
                const storedEvents = eventMap.get(eventDateKey);
                for (const event of storedEvents) {
                    rawEventsList.push(event);
                    eventsProm.push(new CalendarEvent().attach(event));
                }
            }

            // render the due dates...
            if (nullishCheck(this.state.currentDueEvent, 'none') !== 'none') {
                const { eventProm, date } = this.state.currentDueEvent;
                if (date.isSame(cellDate, 'D')) {
                    eventsProm.push(eventProm);
                }
            }

            const encodedEvents = JSON.stringify(rawEventsList);

            const eventList = new CalendarEventList().attach({
                events: eventsProm,
            });
            const cell = new CalendarCell().attach({
                dayNumber,
                cellDate,
                eventList,
                encodedEvents,
            });
            rows.push(cell);
        }

        const remain = 7 - (rows.length % 7);
        for (let dayNumber = 1; dayNumber <= remain; dayNumber++) {
            const cell = new CalendarNextMonthCell().attach({
                dayNumber,
            });
            rows.push(cell);
        }

        return Promise.all(rows).then(elements => div('.calendar', elements));
    }
}

export default CalendarView;
