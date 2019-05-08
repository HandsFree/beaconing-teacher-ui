// @flow
import { div, span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import { AssignedGLPActivityBox } from './recent_activity_box';

class LoadRecentlyAssigned extends Component {
    updateHooks = {
        loadMoreAssigned: this.loadMoreAssigned,
    };

    state = {
        assignedLimit: 5,
    };

    async loadMoreAssigned() {
        this.state.assignedLimit += 5;
        this.updateView(await this.render());
    }

    async init() {
        const recent = await window.beaconingAPI.getRecentlyAssigned();
        console.log('the recently assigned stuff is ', recent);

        this.state.recentlyAssigned = recent;
    }

    async render() {
        let values = Object.values(this.state.recentlyAssigned);

        if (values.length < 1) {
            // Add some style
            return div(
                '.recent-events-container.flex-column',
                div(
                    '.status',
                    span(await window.beaconingAPI.getPhrase('widget_ra_no_act')),
                ),
            );
        }

        // how many events to show
        const maxEventsCount = this.state.assignedLimit;
        let showLoader = maxEventsCount < values.length;
        values = values.slice(0, Math.min(values.length, maxEventsCount));

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

            let recentlyAssignedBox = null;
            switch (target) {
                case 'assignedglp':
                    recentlyAssignedBox = new AssignedGLPActivityBox();
                    break;
                default:
                    console.log('this should never happen');
                    break;
            }

            if (recentlyAssignedBox) {
                const raBoxProm = recentlyAssignedBox.attach({
                    type,
                    createdAt,
                    context,
                });
                promArr.push(raBoxProm);
            }
        }

        return Promise.all(promArr).then(elements => {
            return div(
                '.recent-events-container.flex-column', 
                elements,
                showLoader ? a(
                    '.fake-link',
                    'Load more',
                    {
                        onclick: () => {
                            this.emit('loadMoreAssigned');
                        }
                    }
                ) : [],
            )
        });
    }
}

export default LoadRecentlyAssigned;
