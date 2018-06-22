// @flow

import { div, p } from '../../../../core/html';
import { Component } from '../../../../core/component';

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const { dayNumber, cellDate, eventList } = this.props;

        let classList = '.calendar-cell';
        if (new Date().withoutTime().getTime() === cellDate.getTime()) {
            classList += ' .current-day';
        }

        const el = await eventList;

        return div(classList, p('.calendar-day', dayNumber), el);
    }
}

class CalendarNextMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div('.calendar-cell .next-month', p('.calendar-day', dayNumber));
    }
}

class CalendarPrevMonthCell extends Component {
    async render() {
        const { dayNumber } = this.props;
        return div('.calendar-cell .prev-month', p('.calendar-day', dayNumber));
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
