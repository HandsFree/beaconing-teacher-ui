// @flow
import { div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import LoadRecentlyAssigned from './load_recently_assigned';

class RecentlyAssigned extends Component {
    async init() {
        this.state.trans = await window.beaconingAPI.getPhrases(
            'widget_ra_title',
            'ld',
            'recent_plans',
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
                    '#recent-event',
                    p(`${this.state.trans.get('ld')}...`),
                ),
            ),
        );
    }

    async afterMount() {
        const recentlyAssigned = new LoadRecentlyAssigned();

        const recentlyAssignedEl = await recentlyAssigned.attach();

        const el = div(
            '.draggable.tile.flex-column.flex-2',
            div(
                '.title',
                p(this.state.trans.get('recent_plans')),
            ),
            div(
                '.content',
                div(
                    '#recent-event',
                    recentlyAssignedEl,
                ),
            ),
        );

        this.updateView(el);
    }
}

export default RecentlyAssigned;
