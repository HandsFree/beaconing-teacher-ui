// @flow
import { div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import { StudentActivityBox, GLPActivityBox, AssignedGLPActivityBox } from './recent_activity_box';

class LoadRecentActivities extends Component {
    async init() {
        const recent = await window.beaconingAPI.getRecentActivities();
        console.log('the recent activites are ', recent);

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
                    span(await window.beaconingAPI.getPhrase('widget_ra_no_act')),
                ),
            );
        }

        const promArr = [];

        for (const activity of values) {
            const {
                type,
                createdAt,
                context,
            } = activity;

            // we split since it's
            // always student_deleted, glp_created, etc.
            const target = type.split("_")[0];

            let recentActivityBox = null;
            switch (target) {
                case 'student':
                    recentActivityBox = new StudentActivityBox();
                    break;
                case 'glp':
                    recentActivityBox = new GLPActivityBox();
                    break;
                case 'assignedglp':
                    recentActivityBox = new AssignedGLPActivityBox();
                    break;
            }

            if (recentActivityBox) {
                const raBoxProm = recentActivityBox.attach({
                    type,
                    createdAt,
                    context,
                });
                promArr.push(raBoxProm);
            }
        }

        return Promise.all(promArr)
            .then(elements => div('.recent-activities-container.flex-column', elements));
    }
}

export default LoadRecentActivities;
