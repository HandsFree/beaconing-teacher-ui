// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
// import DashboardNav from './dashboard_nav';
import Widgets from './widgets';

class Dashboard extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        // const dashboardNav = new DashboardNav();
        const widgets = new Widgets();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            // dashboardNav.attach(),
            widgets.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                // dashboardNavEl,
                widgetsEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        // section('.flex-column', dashboardNavEl),
                        widgetsEl,
                    ),
                ),
            );
        });
    }
}

export default Dashboard;
