// @flow
import { div, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class RecentActivities extends Component {
    async render() {
        return div(
            '.tile.flex-column.flex-2',
            div(
                '.title',
                p('Your Recent Activities'),
            ),
            div(
                '.content',
                div(
                    '#recent-activity',
                    div(
                        '.activity',
                        div(
                            '.info',
                            p(
                                'Assigned new lesson plan: ',
                                a('.link-underline', 'Algebra Beginnings'),
                            ),
                        ),
                        div(
                            '.time',
                            p('12:54'),
                        ),
                    ),
                    div(
                        '.activity',
                        div(
                            '.info',
                            p(
                                'Assigned new lesson plan: ',
                                a('.link-underline', 'First Steps to Engineering'),
                            ),
                        ),
                        div(
                            '.time',
                            p({ title: '13:50' }, '12:54'),
                        ),
                    ),
                    div(
                        '.activity',
                        div(
                            '.info',
                            p(
                                'Assigned new lesson plan: ',
                                a('.link-underline', 'Advanced Masonary'),
                            ),
                        ),
                        div(
                            '.time',
                            p({ title: '17:02 03/06/2017' }, '03/06'),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default RecentActivities;
