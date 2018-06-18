// @flow
import { div, nav, a, i, span } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Prompt extends Component {
    async render() {
        return div(
            '#prompt',
            div(
                '.title',
                span('Editing GLP'),
            ),
            nav(
                '.mini',
                a(
                    {
                        href: `//${window.location.host}/lesson_manager`,
                    },
                    i(
                        '.icon-angle-left',
                        {
                            'aria-hidden': true,
                        },
                    ),
                    await window.bcnI18n.getPhrase('lm_library'),
                ),
            ),
        );
    }
}

export default Prompt;
