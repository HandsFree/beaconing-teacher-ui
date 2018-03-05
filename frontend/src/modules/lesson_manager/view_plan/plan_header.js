// @flow
import { div, a, i, h1, nav } from '../../../core/html';

import { Component } from '../../../core/component';

class PlanHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Plan Header] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
    }

    async render() {
        return div(
            '#plan-header',
            a(
                '.back',
                {
                    href: `//${window.location.host}/${this.props.prev}`,
                },
                i('.icon-angle-left'),
                'Go Back',
            ),
            h1(this.state.glp.name),
            nav(
                '.mini',
                a(
                    {
                        href: `http://gameplots.beaconing.eu/game/?externs=http://core.beaconing.eu/api/gamifiedlessonpaths/${this.state.glp.id}/externconfig`,
                        target: '_blank',
                    },
                    'Play',
                ),
                a(
                    {
                        href: `#assign?id=${this.state.glp.id}`,
                    },
                    'Assign',
                ),
            ),
        );
    }
}

export default PlanHeader;