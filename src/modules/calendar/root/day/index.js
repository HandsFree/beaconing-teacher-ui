// @flow
import { header, section, main, div, p } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import CalendarDayView from './day_view';

class CalendarDay extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        const dayView = new CalendarDayView();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            dayView.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                calendarDayViewEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    main('#calendar',
                        calendarDayViewEl,
                    ),
                ),
            );
        });
    }
}

export default CalendarDay;