// @flow
import { div, a, i, h1, h2 } from '../../../core/html';

import { Component } from '../../../core/component';

class AssignHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Header] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
    }

    async render() {
        return div(
            '#assign-header',
            a(
                '.back',
                {
                    href: `//${window.location.host}/lesson_manager`,
                },
                i('.icon-angle-left'),
                'Go Back',
            ),
            div(
                '.name-group',
                h1('Assigning:'),
                h2(this.state.glp.name),
            ),
            div('.header-spacer'),
        );
    }
}

export default AssignHeader;
