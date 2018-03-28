// @flow
import { nav, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class DashboardNav extends Component {
    async render() {
        return nav(
            '.mini.spaced.flex-justify-end',
            a(
                '.item',
                {
                    onclick: () => {
                        this.emit('EditLayoutClicked');
                    },
                },
                'Edit Layout',
            ),
        );
    }
}

export default DashboardNav;
