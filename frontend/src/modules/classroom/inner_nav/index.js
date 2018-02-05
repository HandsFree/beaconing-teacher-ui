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
                /^classroom\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/`,
                },
                span('Students'),
            ),
            a(
                /^classroom\/groups\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/groups`,
                },
                span('Groups'),
            ),
            a(
                /^classroom\/classes\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/classes`,
                },
                span('Classes'),
            ),
            a(
                /^classroom\/courses\/?$/.test(path) ? '.item.active-white' : '.item',
                {
                    href: `//${window.location.host}/classroom/courses`,
                },
                span('Courses'),
            ),
        );
    }
}

export default InnerNav;
