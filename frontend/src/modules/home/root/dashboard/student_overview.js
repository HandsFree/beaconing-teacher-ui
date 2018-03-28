// @flow
import { div, p, a, i, span, h3, img } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentOverview extends Component {
    async render() {
        // TODO: way too beefy, need to split into other components
        // (this component will become defunct depending on analytics changes)
        return div(
            '.draggable.tile.flex-column',
            div(
                '.title',
                p('Student Overview'),
                a(
                    {
                        href: `//${window.location.host}/classroom/`,
                    },
                    i(
                        '.icon-link-ext-alt',
                        {
                            title: 'View Students',
                            'aria-hidden': true,
                        },
                    ),
                ),
            ),
            div(
                '.content',
                div(
                    '#student-overview',
                    div(
                        '.sorting',
                        div(
                            '.sort-menu',
                            span('Class: '),
                            a('.active', '11b'),
                            a('13a'),
                        ),
                        div(
                            '.sort-menu',
                            span('Sort By: '),
                            a('This Week'),
                            a('.active', 'This Month'),
                            a('This Year'),
                        ),
                    ),
                    div(
                        '.flex-container',
                        div(
                            '.student-section',
                            div(
                                '.title',
                                h3('Best Performing'),
                            ),
                            div(
                                '.students',
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-green',
                                                    {
                                                        style: {
                                                            width: '96%',
                                                        },
                                                    },
                                                    span('96%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-green',
                                                    {
                                                        style: {
                                                            width: '94%',
                                                        },
                                                    },
                                                    span('94%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-green',
                                                    {
                                                        style: {
                                                            width: '91%',
                                                        },
                                                    },
                                                    span('91%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                        div(
                            '.student-section',
                            div(
                                '.title',
                                h3('Needs Attention'),
                            ),
                            div(
                                '.students',
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-red',
                                                    {
                                                        style: {
                                                            width: '30%',
                                                        },
                                                    },
                                                    span('30%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-red',
                                                    {
                                                        style: {
                                                            width: '28%',
                                                        },
                                                    },
                                                    span('28%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-red',
                                                    {
                                                        style: {
                                                            width: '25%',
                                                        },
                                                    },
                                                    span('25%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                        div(
                            '.student-section',
                            div(
                                '.title',
                                h3('Most Improvement'),
                            ),
                            div(
                                '.students',
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-amber',
                                                    {
                                                        style: {
                                                            width: '70%',
                                                        },
                                                    },
                                                    span('70%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-amber',
                                                    {
                                                        style: {
                                                            width: '68%',
                                                        },
                                                    },
                                                    span('68%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                div(
                                    '.student',
                                    div(
                                        '.flex-container.tablet-hide',
                                        div(
                                            '.student-profile-image',
                                            img(
                                                '.profile-blue',
                                                {
                                                    src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                                    alt: 'Example Student',
                                                },
                                            ),
                                        ),
                                    ),
                                    div(
                                        '.flex-container.flex-column.flex-spacearound.flex-grow',
                                        div(
                                            '.student-name',
                                            p('Example Student'),
                                        ),
                                        div(
                                            '.student-percentage',
                                            p('Overall Percentage:'),
                                            div(
                                                '.progress-bar',
                                                div(
                                                    '.status-amber',
                                                    {
                                                        style: {
                                                            width: '59%',
                                                        },
                                                    },
                                                    span('59%'),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default StudentOverview;
