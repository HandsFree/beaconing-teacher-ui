// @flow
import { div, a, span } from '../../../core/html';

import { Component } from '../../../core/component';

class InnerNav extends Component {
    state = {
        path: window.location.pathname.slice(1),
    };

    async render() {
        const { path } = this.state;

        return div(
            '.nav-group',
            a(
                /^lesson_manager\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/lesson_manager/`,
                },
                span('Library'),
            ),
        );
    }
}

export default InnerNav;
