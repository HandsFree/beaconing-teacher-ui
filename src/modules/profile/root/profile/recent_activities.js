// @flow
import { div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import LoadRecentActivities from './load_recent_activities';

class RecentActivities extends Component {
    async init() {
        this.state.trans = await window.beaconingAPI.getPhrases(
            'widget_ra_title',
            'ld',
        );
    }

    async render() {
        return div(
            '.draggable.tile.flex-column.flex-2',
            div(
                '.title',
                p(this.state.trans.get('widget_ra_title')),
            ),
            div(
                '.content',
                div(
                    '#recent-activity',
                    p(`${this.state.trans.get('ld')}...`),
                ),
            ),
        );
    }

    async afterMount() {
        const loadActivities = new LoadRecentActivities();

        const loadActivitiesEl = await loadActivities.attach();

        const el = div(
            '.draggable.tile.flex-column.flex-2',
            div(
                '.title',
                p(this.state.trans.get('widget_ra_title')),
            ),
            div(
                '.content',
                div(
                    '#recent-activity',
                    loadActivitiesEl,
                ),
            ),
        );

        this.updateView(el);
    }
}

export default RecentActivities;
