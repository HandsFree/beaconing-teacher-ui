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
        const { name, desc, id, date } = this.props;
        return div(
            '.calendar-day-slot',
            p(
                a(
                    '.fake-link',
                    {
                        href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
                    },
                    name
                ),
            ),
            p(desc),
        );
    }
}

class CalendarDayView extends Component {
    async hide() {
        window.sessionStorage.setItem('calendarDayData', 'none');

        this.emit('UpdateCalendarContainer');
        this.emit('RefreshCalendarView');
    }
    
    async render() {
        const data = window.sessionStorage.getItem('calendarDayData');
        if (data === 'none') {
            return div();
        }

        // FIXME the events we're passed here are wrong?
        // there is only a date passed.

        const eventsObj = nullishCheck(JSON.parse(data), []);

        let dateSample = null;

        const calendarEventSet = [];
        for (const event of eventsObj) {
            calendarEventSet.push(new CalendarDaySlot().attach(event));

            // sample a date. these events should all be the
            // same day so we just take the last event in the list
            const { date } = event;
            dateSample = date;
        }

        return div(
            '.calendar-day-container',

            p(
                a(
                    '.btn',
                    {
                        role: 'button',
                        onclick: () => {
                            this.hide();
                        },
                        href: '#',
                    },
                    await window.bcnI18n.getPhrase('cal_back_to_calendar'),
                ),
            ),

            div(
                '.calendar-day-heading',
                p(moment(dateSample).format('dddd - Do of MMMM, YYYY')),
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
