// @flow
import { div, p, a, i, img } from '../../../core/html';

import { Component } from '../../../core/component';

class ActivePlans extends Component {
    async render() {
        return div(
            '.tile.flex-column.flex-2',
            div(
                '.title',
                p('Active Lesson Plans'),
                a(
                    {
                        href: './lesson_manager/',
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
                    div(
                        '.plan',
                        div(
                            '.image',
                            img({
                                src: 'dist/beaconing/images/quest-image.jpg',
                                alt: 'Algebra Beginnings',
                            }),
                        ),
                        div(
                            '.info',
                            div(
                                '.name',
                                p('Algebra Beginnings'),
                            ),
                        ),
                    ),
                    div(
                        '.plan',
                        div(
                            '.image',
                            img({
                                src: 'dist/beaconing/images/quest-image.jpg',
                                alt: 'First steps to Engineering',
                            }),
                        ),
                        div(
                            '.info',
                            div(
                                '.name',
                                p('First steps to Engineering'),
                            ),
                        ),
                    ),
                    div(
                        '.plan',
                        div(
                            '.image',
                            img({
                                src: 'dist/beaconing/images/quest-image.jpg',
                                alt: 'Advanced Masonary',
                            }),
                        ),
                        div(
                            '.info',
                            div(
                                '.name',
                                p('Advanced Masonary'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default ActivePlans;
