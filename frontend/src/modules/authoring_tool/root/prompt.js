// @flow
import { div, nav, a, i, span } from '../../../core/html';

import { Component } from '../../../core/component';

class Prompt extends Component {
    async render(params: { [string]: string }) {
        return div(
            '#prompt',
            div(
                '.title',
                span('Editing GLP:'),
                span('.name', decodeURIComponent(params.name)),
            ),
            nav(
                '.mini',
                a(
                    {
                        href: `./${decodeURIComponent(params.prev)}`,
                    },
                    i(
                        '.icon-angle-left',
                        {
                            'aria-hidden': true,
                        },
                    ),
                    'Go Back',
                ),
            ),
        );
    }
}

export default Prompt;
