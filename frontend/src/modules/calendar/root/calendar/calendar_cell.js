// @flow

import { div, p } from '../../../../core/html';
import { Component } from '../../../../core/component';

// https://github.com/palantir/blueprint/issues/959
let moment = require("moment");
if ("default" in moment) {
    moment = moment["default"];
}

// an individual cell in the calendar
class CalendarCell extends Component {
    async render() {
        const { dayNumber, cellDate, eventList } = this.props;

        let classList = '.calendar-cell';
        if (moment().isSame(cellDate, 'D')) {
            classList += '.current-day';
        }

        const el = await eventList;

        return div(classList, p('.calendar-day', `${dayNumber}`), el);
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
