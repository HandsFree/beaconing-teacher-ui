// @flow
import { div, p, a, i } from '../../../../core/html';

import { Component } from '../../../../core/component';
import LoadActivePlans from './load_active_plans';

class ActivePlans extends Component {
    async render() {
        return div(
            '.tile.flex-column.flex-2',
            div(
                '.title',
                p('Active Lesson Plans'),
                a(
                    {
                        href: `${window.location.host}/lesson_manager/`,
                    },
                    i(
                        '.icon-link-ext-alt',
                        {
                            title: 'View Active Lesson Plans',
                            'aria-hidden': true,
                        },
                    ),
                ),
            ),
            div(
                '.content',
                div('#active-plan-summary', 'Loading...'),
            ),
        );
    }

    async afterMount() {
        const activePlans = new LoadActivePlans();

        const activePlansEl = await activePlans.attach();

        const element = div(
            '.tile.flex-column.flex-2',
            div(
                '.title',
                p('Active Lesson Plans'),
                a(
                    {
                        href: `//${window.location.host}/lesson_manager/`,
                    },
                    i(
                        '.icon-link-ext-alt',
                        {
                            title: 'View Active Lesson Plans',
                            'aria-hidden': true,
                        },
                    ),
                ),
            ),
            div(
                '.content',
                div(
                    '#active-plan-summary',
                    activePlansEl,
                ),
            ),
        );

        this.updateView(element);
    }
}

export default ActivePlans;
