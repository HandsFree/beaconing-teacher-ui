// @flow

import { div, p } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const { dayNumber, cellDate, eventList } = this.props;

        let classList = ".calendar-cell";
        if (new Date().withoutTime().getTime() === cellDate.getTime()) {
            classList += " .current-day";
        }

        return Promise.resolve(eventList).then((el) => {
            return div(classList, p(".calendar-day", dayNumber), el);
        });
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

export { 
    CalendarCell,
    CalendarHeadingCell,
    CalendarPrevMonthCell,
    CalendarNextMonthCell,
};