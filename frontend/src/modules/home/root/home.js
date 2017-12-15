// @flow

import Component from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';
import DashboardNav from './dashboard_nav';
import BasicSearch from '../../search/basic';
import RecentActivities from './recent_activities';
import ActivePlans from './active_plans';
import StudentOverview from './student_overview';

class Home extends Component {
    async render(): Promise<string> {
        const header = new Header();
        const mainNav = new MainNav();
        const dashboardNav = new DashboardNav();
        const search = new BasicSearch();
        const recentActivities = new RecentActivities();
        const activePlans = new ActivePlans();
        const studentOverview = new StudentOverview();

        return Promise.all([
            header.render(),
            mainNav.render(),
            dashboardNav.render(),
            search.render({
                type: 'width-expand',
            }),
            recentActivities.render(),
            activePlans.render(),
            studentOverview.render(),
        ]).then((values) => {
            const [
                headerHTML,
                mainNavHTML,
                dashboardNavHTML,
                searchHTML,
                recentActivitiesHTML,
                activePlansHTML,
                studentOverviewHTML,
            ] = values;

            return this.preparePage('home/root/templates/home', {
                headerHTML,
                mainNavHTML,
                dashboardNavHTML,
                searchHTML,
                recentActivitiesHTML,
                activePlansHTML,
                studentOverviewHTML,
            });
        });
    }
}

export default Home;
