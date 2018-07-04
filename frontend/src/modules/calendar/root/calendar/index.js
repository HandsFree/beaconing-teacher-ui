// @flow
import moment from 'moment';
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import SelectorPanel from './student_selector';
import SecondNav from '../../../nav/second';
import CalendarInnerNav from './calendar_inner_nav';

class Calendar extends RootComponent {
    async init() {
        let studentID = 'none'; // set to string due to sessionStorage
        if (this.params.id) {
            studentID = this.params.id;
        }

        window.sessionStorage.setItem('calendarDate', moment());
    }

    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        const calendarView = new CalendarView();
        const studentSelector = new SelectorPanel();
        const calendarController = new CalendarController();
        
        const secondNav = new SecondNav();
        const calInnerNav = new CalendarInnerNav();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Calendar',
                innerNav: calInnerNav.attach(),
            }),
            calendarController.attach(),
            calendarView.attach(),
            studentSelector.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                calendarControllerEl,
                calendarViewEl,
                studentSelectorEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main('#calendar',
                        section('.outer-col',
                            studentSelectorEl,
                            section('.full-width',
                                calendarControllerEl,
                                calendarViewEl,
                            ),
                        ),
                    ),
                ),
            );
        });
    }
}

export default Calendar;
