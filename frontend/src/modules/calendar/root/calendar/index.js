// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import CalendarView from './calendar';

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
        const calendarView = new CalendarView();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            calendarView.attach(this.state),
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
