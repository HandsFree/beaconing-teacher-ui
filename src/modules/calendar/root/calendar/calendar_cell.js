// @flow
import moment from 'moment';

import {
    div,
    p,
    a,
    i,
} from '../../../../core/html';

import { Component } from '../../../../core/component';

// an individual cell in the calendar
class CalendarCell extends Component {
    async init() {
        this.state = {
            viewTranslation: await window.beaconingAPI.getPhrase('view'),
        }
    }

    async render() {
        const {
            dayNumber, cellDate, eventList, encodedEvents,
        } = this.props;

        const {
            viewTranslation
        } = this.state;

        const el = await eventList;

        const viewDayEl = p('.view-calendar-day',
            a(
                '.fake-link',
                {
                    onclick: () => {
                        const data = {
                            date: cellDate,
                            encodedEvents,
                        };
                        window.sessionStorage.setItem('calendarDayData', JSON.stringify(data));
                        this.emit('UpdateCalendarContainer');
                    },
                    title: viewTranslation,
                },
                i('.icon-link-ext-alt'),
            ),
        );

        const cell = div(
            '.calendar-cell',
            div(
                '.calendar-cell-meta',
                p('.calendar-day', dayNumber),
                viewDayEl,
            ),

            // TODO this is where events go
            // if their due date spans this element!

            el,
        );

        // add the current day class to highlight the current day.
        if (moment().isSame(cellDate, 'D')) {
            cell.classList.add('current-day');
        }

        return cell;
    }
}

class CalendarNextMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div('.calendar-cell.next-month', p('.calendar-day', dayNumber));
    }
}

class CalendarPrevMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div('.calendar-cell.prev-month', p('.calendar-day', dayNumber));
    }
}

class CalendarHeadingCell extends Component {
    async render() {
        const name = this.props.dayName;
        return div('.calendar-heading-cell', p(name));
    }
}

export {
    CalendarCell,
    CalendarHeadingCell,
    CalendarPrevMonthCell,
    CalendarNextMonthCell,
};
