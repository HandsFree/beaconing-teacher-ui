// @flow
import { div, main, section } from '../../../core/html';

import { RootComponent } from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';

class ViewPlan extends RootComponent {
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
                    main(
                        '#view-plan',
                        section('.flex-column'),
                    ),
                ),
            );
        });
    }
}

export default ViewPlan;
