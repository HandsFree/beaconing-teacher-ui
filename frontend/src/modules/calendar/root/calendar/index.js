// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';

class Calendar extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(),
                ),
            );
        });
    }
}

export default Calendar;
