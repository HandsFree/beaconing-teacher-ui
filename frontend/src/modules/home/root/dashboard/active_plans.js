// @flow
import { div, p, a, i } from '../../../../core/html';

import { Component } from '../../../../core/component';
import LoadActivePlans from './load_active_plans';

class ActivePlans extends Component {
    async render() {
        return div(
            '.draggable.tile.flex-column.flex-2',
            div(
                '.title',
                p(await window.bcnI18n.getPhrase('widget_ap_title')),
                a(
                    {
                        onclick: () => {
                            this.handleActivePlansClick();
                        },
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
            '.draggable.tile.flex-column.flex-2',
            div(
                '.title',
                p(await window.bcnI18n.getPhrase('widget_ap_title')),
                a(
                    {
                        onclick: () => {
                            this.handleActivePlansClick();
                        },
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

    handleActivePlansClick() {
        // temp fix
        if (window.sessionStorage) {
            window.sessionStorage.setItem('library_init', 'active');
            window.location.href = `//${window.location.host}/lesson_manager`;

            return;
        }

        window.location.href = `//${window.location.host}/lesson_manager`;
    }
}

export default ActivePlans;
