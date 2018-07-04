// @flow
import moment from 'moment';
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import SecondNav from '../../../nav/second';

// yikes is the point of this that i would copy
// this class into this module or can I just reuse
// the classroom one?
import InnerNav from '../../../classroom/inner_nav';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import SelectorPanel from './student_selector';

class Calendar extends RootComponent {
    async init() {
        let studentID = 'none'; // set to string due to sessionStorage
        if (this.params.id) {
            studentID = this.params.id;
        }

        window.sessionStorage.setItem('calendarStudentID', studentID);
        window.sessionStorage.setItem('calendarDate', moment());
    }

    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        const calendarView = new CalendarView();
        const studentSelector = new SelectorPanel();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const calendarController = new CalendarController();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('calendar'),
                innerNav: innerNav.attach(),
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
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#calendar',
                        section(
                            '.full-width',
                            calendarControllerEl,
                            calendarViewEl,
                        ),
                    ),
                ),
            );
        });
    }
}

export default Calendar;
