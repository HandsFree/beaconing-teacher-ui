// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import { StudentSelector, StudentGroupSelector, SelectorPanel } from './student_selector';

class Calendar extends RootComponent {
    async init() {
        let studentID = -1;
        if (this.params.id) {
            studentID = this.params.id;
        }

        window.sessionStorage.setItem('calendarStudentID', studentID);
        window.sessionStorage.setItem('calendarDate', new Date());
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
                calendarController,
                calendarView,
                studentSelector,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        section('.outer-col', 
                            studentSelector,
                            section('.full-width', 
                                calendarController,
                                calendarView
                            )
                        )
                    ),
                ),
            );
        });
    }
}

export default Calendar;
