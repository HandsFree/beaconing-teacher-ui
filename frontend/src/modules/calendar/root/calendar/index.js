// @flow
import moment from 'moment';
import { div, main, section, p, a } from '../../../../core/html';

import { RootComponent, Component } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import SelectorPanel from './student_selector';
import SecondNav from '../../../nav/second';
import CalendarInnerNav from './calendar_inner_nav';
import nullishCheck from '../../../../core/util';

class CalendarDaySlot extends Component {
    async render() {
        const { date } = this.props;
        // FIXME this event prop is wrong.
        return div(
            '.calendar-day-slot',
            p(`${date}`),
        );
    }
}

class CalendarDayView extends Component {
    async render() {
        const data = window.sessionStorage.getItem('calendarDayData');
        if (data === 'none') {
            return div();
        }

        // FIXME the events we're passed here are wrong?
        // there is only a date passed.

        const eventsObj = nullishCheck(JSON.parse(data), []);

        const calendarEventSet = [];
        for (const event of eventsObj) {
            calendarEventSet.push(new CalendarDaySlot().attach(event));
        }

        return div(
            '.calendar-day-container',

            p(a(
                '.btn', 
                {
                    role: 'button',
                    onclick: () => {
                        window.sessionStorage.setItem('calendarDayData', 'none');
                        this.emit('UpdateCalendarContainer');
                    },
                    href: '#',
                }, 
                'Back to Calendar')
            ),

            div(
                '.calendar-day-heading',
                p('Monday'),
            ),
            await Promise.all(calendarEventSet).then(el => el),
        );
    }
}

// Wrapper around the calendar views
// two views right now:
//
// calendar day view
// calendar view (student selector, calendar itself, and a controller)
class CalendarContainer extends Component {
    updateHooks = {
        UpdateCalendarContainer: this.update,
    };

    async update() {
        this.updateView(await this.render());
    }

    async render() {
        // check for calendar day view
        if (nullishCheck(window.sessionStorage.getItem('calendarDayData'), 'none') !== 'none') {
            const calDayView = new CalendarDayView().attach();
            return Promise.resolve(calDayView).then(el => el);
        }

        const calendarView = new CalendarView();
        const studentSelector = new SelectorPanel();
        const calendarController = new CalendarController();

        return Promise.all([
            calendarController.attach(),
            calendarView.attach(),
            studentSelector.attach(),
        ]).then((values) => {
            const [
                calendarControllerEl,
                calendarViewEl,
                studentSelectorEl,
            ] = values;

            return section('.outer-col',
                studentSelectorEl,
                section('.full-width',
                    calendarControllerEl,
                    calendarViewEl,
                ),
            );
        });
    }
}

class Calendar extends RootComponent {
    async init() {
        window.sessionStorage.setItem('calendarSelection', 'none');
        window.sessionStorage.setItem('calendarDate', moment());
    }

    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        const secondNav = new SecondNav();
        const calInnerNav = new CalendarInnerNav();

        const calContainer = new CalendarContainer();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Calendar',
                innerNav: calInnerNav.attach(),
            }),
            calContainer.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                calContainerEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main('#calendar',
                        calContainerEl,
                    ),
                ),
            );
        });
    }
}

export default Calendar;
