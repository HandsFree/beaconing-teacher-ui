// @flow
import moment from 'moment';

import { div, p, a, i } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const { dayNumber, cellDate, eventList, encodedEvents } = this.props;

        console.log("ZE ENCODED EVTS ", encodedEvents);

        const eventsData = JSON.parse(nullishCheck(encodedEvents, '[]'));

        let classList = '.calendar-cell';
        if (moment().isSame(cellDate, 'D')) {
            classList += '.current-day';
        }

        const el = await eventList;

        const viewDayEl = p('.view-calendar-day', 
            a(
                '.fake-link', 
                {
                    onclick: () => {
                        window.sessionStorage.setItem('calendarDayData', encodedEvents);
                        this.emit('UpdateCalendarContainer');
                    },
                    title: await window.bcnI18n.getPhrase('view'),
                }, 
                i('.icon-link-ext-alt'),
            )
        );

        return div(
            classList,
            div(
                '.calendar-cell-meta',

                p('.calendar-day', dayNumber),

                // we only show this button if we have
                // more than 0 events.
                eventsData.length === 0 ? [] : viewDayEl,
            ), 
            el
        );
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
