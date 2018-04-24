// @flow
// import Swappable from '@shopify/draggable/lib/swappable';

import { section, div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import RecentActivities from './recent_activities';
import ActivePlans from './active_plans';
import StudentOverview from './student_overview';
import QuerySearch from '../../../search/query';

class Widgets extends Component {
    // updateHooks = {
    //     EditLayoutClicked: this.editMode,
    // };

    async render() {
        const recentActivities = new RecentActivities();
        const activePlans = new ActivePlans();
        const studentOverview = new StudentOverview();
        const search = new QuerySearch();

        const recentActivitiesEl = await recentActivities.attach();
        const activePlansEl = await activePlans.attach();
        const studentOverviewEl = await studentOverview.attach();
        const searchEl = await search.attach({ searchType: 'width-expand' });

        return div(
            '.flex-column',
            section('.draggable-container.flex-column', searchEl),
            section(
                '.draggable-container.flex-spacearound.mobile-collapse',
                recentActivitiesEl,
                activePlansEl,
            ),
            section('.draggable-container.flex-column', studentOverviewEl),
        );
    }

    // async editMode() {
    //     const containers = document.querySelectorAll('.draggable-container');
    //     const swap = new Swappable(containers, {
    //         draggable: '.draggable',
    //     });
    // }
}

export default Widgets;
