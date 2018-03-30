// @flow
// import List from 'list.js';

import { div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import RecentActivityBox from './recent_activity_box';

class LoadRecentActivities extends Component {
    async init() {
        const recent = await window.beaconingAPI.getRecentActivitiesWidget();

        this.state.recentActivities = recent;
    }

    async render() {
        const values = Object.values(this.state.recentActivities);

        if (values.length < 1) {
            // Add some style
            return div(
                '.recent-activities-container.flex-column',
                div(
                    '.status',
                    span('No Recent Activities'),
                ),
            );
        }

        const promArr = [];

        for (const activity of values) {
            const {
                Message,
                ExecutionTime,
            } = activity;

            const recentActivityBox = new RecentActivityBox();
            const raBoxProm = recentActivityBox.attach({
                Message,
                ExecutionTime,
                GroupName: activity.GroupName ?? null,
            });

            promArr.push(raBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => div('.recent-activities-container.flex-column', elements));
    }
}

export default LoadRecentActivities;
