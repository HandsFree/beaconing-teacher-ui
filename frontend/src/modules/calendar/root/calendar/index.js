// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

import CalendarView from './calendar_view';
import CalendarController from './calendar_controller';
import { StudentSelector, StudentGroupSelector, SelectorPanel } from './student_selector';

class Calendar extends RootComponent {
    state = {
        id: 0,
    };

    async init() {
        if (this.params.id) {
            this.state.id = this.params.id;
        }
    }

    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        const calendarController = new CalendarController(this.state.id);
        const calendarView = new CalendarView();
        const studentSelector = new SelectorPanel(calendarView);

        console.log("calendar index");

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
                        studentSelector,
                        calendarController,
                        calendarView
                    ),
                ),
            );
        });
    }
}

export default Calendar;
