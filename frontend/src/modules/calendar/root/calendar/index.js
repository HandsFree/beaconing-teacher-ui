// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import CalendarView from './calendar';

class Calendar extends RootComponent {
    async init() {
    }

    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const calendarView = new CalendarView();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            calendarView.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                calendarView,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(calendarView),
                ),
            );
        });
    }
}

export default Calendar;
