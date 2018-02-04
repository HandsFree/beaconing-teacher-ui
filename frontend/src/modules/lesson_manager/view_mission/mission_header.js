// @flow
import { div, a, i, h1, nav, h2 } from '../../../core/html';

import { Component } from '../../../core/component';

class MissionHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Mission Header] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
        this.state.mission = this.state.glp.missions[this.props.index];
    }

    async render() {
        return div(
            '#mission-header',
            a(
                '.back',
                {
                    href: `//${window.location.host}/${this.props.prev}`,
                },
                i('.icon-angle-left'),
                'Go Back',
            ),
            div(
                '.name-group',
                h1(this.state.glp.name),
                h2(this.state.mission.name),
            ),
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

export default MissionHeader;
