// @flow
import { div, a, span } from '../../../../core/html';

import { Component } from '../../../../core/component';

class InnerNav extends Component {
    state = {
        path: window.location.pathname.slice(1),
    };

    async render() {
        const { path } = this.state;

        return div(
            '.nav-group',
            a(
                /^classroom\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: './classroom/',
                },
                span('Students'),
            ),
        );
    }
}

export default InnerNav;
