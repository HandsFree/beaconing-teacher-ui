// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import SelectorPanel from './student_selector';

// https://github.com/palantir/blueprint/issues/959
let moment = require("moment");
if ("default" in moment) {
    moment = moment["default"];
}

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
        const calendarController = new CalendarController();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            calendarController.attach(),
            calendarView.attach(),
            studentSelector.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                calendarControllerEl,
                calendarViewEl,
                studentSelectorEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        '#calendar',
                        section(
                            '.outer-col',
                            studentSelectorEl,
                            section(
                                '.full-width',
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
