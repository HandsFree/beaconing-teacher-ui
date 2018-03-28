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
                /^classroom\/?$|^classroom\/student\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/`,
                },
                span('Students'),
            ),
            a(
                /^classroom\/groups\/?$|^classroom\/group\/?/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/groups`,
                },
                span('Groups'),
            ),
        );
    }
}

export default InnerNav;
