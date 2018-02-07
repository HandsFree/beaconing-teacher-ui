// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import DashboardNav from './dashboard_nav';
import QuerySearch from '../../../search/query';
import RecentActivities from './recent_activities';
import ActivePlans from './active_plans';
import StudentOverview from './student_overview';

class Dashboard extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const dashboardNav = new DashboardNav();
        const search = new QuerySearch();
        const recentActivities = new RecentActivities();
        const activePlans = new ActivePlans();
        const studentOverview = new StudentOverview();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            dashboardNav.attach(),
            search.attach({
                searchType: 'width-expand',
            }),
            recentActivities.attach(),
            activePlans.attach(),
            studentOverview.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                dashboardNavEl,
                searchEl,
                recentActivitiesEl,
                activePlansEl,
                studentOverviewEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        section('.flex-column', dashboardNavEl),
                        section('.flex-column', searchEl),
                        section(
                            '.flex-spacearound.mobile-collapse',
                            recentActivitiesEl,
                            activePlansEl,
                        ),
                        section('.flex-column', studentOverviewEl),
                    ),
                ),
            );
        });
    }

    // async afterMount() {

    // }
}

export default Dashboard;
